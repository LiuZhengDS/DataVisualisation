/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package volume;

import java.io.File;
import java.io.IOException;

/**
 *
 * @author michel modified by Anna
 */

//////////////////////////////////////////////////////////////////////
///////////////// CONTAINS FUNCTIONS TO BE IMPLEMENTED ///////////////
//////////////////////////////////////////////////////////////////////

public class Volume {
    

    //Do NOT modify these attributes
    private int dimX, dimY, dimZ;
    private short[] data;
    private int[] histogram;

    // Do NOT modify this function
    // This function returns the nearest neighbour given a position in the volume given by coord.
    public short getVoxelNN(double[] coord) {
        if (coord[0] < 0 || coord[0] > (dimX-1) || coord[1] < 0 || coord[1] > (dimY-1)
                || coord[2] < 0 || coord[2] > (dimZ-1)) {
            return 0;
        }
        /* notice that in this framework we assume that the distance between neighbouring voxels is 1 in all directions*/
        int x = (int) Math.round(coord[0]); 
        int y = (int) Math.round(coord[1]);
        int z = (int) Math.round(coord[2]);
    
        return getVoxel(x, y, z);
    }
        

    //Do NOT modify this function
    //This function linearly interpolates the value g0 and g1 given the factor (t) 
    //the result is returned. It is used for the tri-linearly interpolation the values 
    private float interpolate(float g0, float g1, float factor) {
        float result = (1 - factor)*g0 + factor*g1;
        return result; 
    }
             
    //Do NOT modify this function
    // This function returns the trilinear interpolated value of the position given by  position coord.
    public float getVoxelLinearInterpolate(double[] coord) {
        if (coord[0] < 0 || coord[0] > (dimX-2) || coord[1] < 0 || coord[1] > (dimY-2)
                || coord[2] < 0 || coord[2] > (dimZ-2)) {
            return 0;
        }
        /* notice that in this framework we assume that the distance between neighbouring voxels is 1 in all directions*/
        int x = (int) Math.floor(coord[0]); 
        int y = (int) Math.floor(coord[1]);
        int z = (int) Math.floor(coord[2]);
        
        float fac_x = (float) coord[0] - x;
        float fac_y = (float) coord[1] - y;
        float fac_z = (float) coord[2] - z;

        float t0 = interpolate(getVoxel(x, y, z), getVoxel(x+1, y, z), fac_x);
        float t1 = interpolate(getVoxel(x, y+1, z), getVoxel(x+1, y+1, z), fac_x);
        float t2 = interpolate(getVoxel(x, y, z+1), getVoxel(x+1, y, z+1), fac_x);
        float t3 = interpolate(getVoxel(x, y+1, z+1), getVoxel(x+1, y+1, z+1), fac_x);
        float t4 = interpolate(t0, t1, fac_y);
        float t5 = interpolate(t2, t3, fac_y);
        float t6 = interpolate(t4, t5, fac_z);
        
        return t6; 
    }


    float a= - 1.0f;   // variable used in cubic interpolation

    /**
     * Compute the weight/influence of the known data to unknown data by cubic interpolation.
     * @param x
     * @return
     */
   private float weight(double x){
        double distance = Math.abs(x);
        float result = 0.0f;

        if(distance < 1)
            result = (float)((a + 2) * Math.pow(distance, 3) - (a + 3) * Math.pow(distance, 2) + 1);
        else if(distance < 2)
            result = (float)(a * Math.pow(distance, 3) - 5 * a * Math.pow(distance, 2) + 8 * a * distance - 4 * a);
        else
            result = 0.0f;

        return result;
   }

   /**
    * Computes 1D cubic interpolation by using 4 samples.
    * Parameters g0, g1, g2, g3 contain values of the voxels used for interpolation
    * @param factor the distance from position g1 to sample want to interpolate
    * @return interpolated value 
    */
    private float cubicinterpolate(float g0, float g1, float g2, float g3, float factor) {           
        
        float f0 = weight(factor + 1);
        float f1 = weight(factor);
        float f2 = weight(factor - 1);
        float f3 = weight(factor - 2);
        
        float result = f0 * g0 + f1 * g1 + f2 * g2 + f3 * g3;    
        if(result < 0)
            result = 0.0f;
        return result; 
    }
        
    /**
     * Computes 2D interpolation on XY-plane. 
     * @param coord Coordinates of point we want to interpolate
     * @param z the location of point on z-Axis
     * @return interpolated value on XY-plane
     */
    private float bicubicinterpolate(double[] coord, int z) {
                         
        int x = (int)Math.floor(coord[0]);
        int y = (int)Math.floor(coord[1]);
        float x_fac = (float)(coord[0] - x);
        float y_fac = (float)(coord[1] - y);
        
        float g0 = cubicinterpolate(getVoxel(x-1, y-1, z), getVoxel(x, y-1, z), getVoxel(x+1, y-1, z), getVoxel(x+2, y-1, z), x_fac);
        float g1 = cubicinterpolate(getVoxel(x-1, y, z), getVoxel(x, y, z), getVoxel(x+1, y, z), getVoxel(x+2, y, z), x_fac);
        float g2 = cubicinterpolate(getVoxel(x-1, y+1, z), getVoxel(x, y+1, z), getVoxel(x+1, y+1, z), getVoxel(x+2, y+1, z), x_fac);
        float g3 = cubicinterpolate(getVoxel(x-1, y+2, z), getVoxel(x, y+2, z), getVoxel(x+1, y+2, z), getVoxel(x+2, y+2, z), x_fac);
        
        float result = cubicinterpolate(g0, g1, g2, g3, y_fac);       
        return result; 
    }

            
    /**
     * Compute 3D cubic interpolation in three dimensional Cartesian coordinate system.
     * The point to be interpolated possess coordinates in (double, double, double).
     * @param coord The coordinates of the voxel wanted to interpolated.
     * @return Estimated value of coord by cubic interpolation method.
     */
    public float getVoxelTriCubicInterpolate(double[] coord) {
        if (coord[0] < 1 || coord[0] > (dimX-3) || coord[1] < 1 || coord[1] > (dimY-3)
                || coord[2] < 1 || coord[2] > (dimZ-3)) {
            return 0;
        }
        
        int z = (int)Math.floor(coord[2]);
        float z_fac = (float)(coord[2] - z);
        
        float g0 = bicubicinterpolate(coord, z-1);
        float g1 = bicubicinterpolate(coord, z);
        float g2 = bicubicinterpolate(coord, z+1);
        float g3 = bicubicinterpolate(coord, z+2);
                 
        float result = cubicinterpolate(g0, g1, g2, g3, z_fac);               
        return result; 
    }



//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////

	
    //Do NOT modify this function
    public Volume(int xd, int yd, int zd) {
        data = new short[xd*yd*zd];
        dimX = xd;
        dimY = yd;
        dimZ = zd;
    }
    //Do NOT modify this function
    public Volume(File file) {
        
        try {
            VolumeIO reader = new VolumeIO(file);
            dimX = reader.getXDim();
            dimY = reader.getYDim();
            dimZ = reader.getZDim();
            data = reader.getData().clone();
            computeHistogram();
        } catch (IOException ex) {
            System.out.println("IO exception");
        }
        
    }
    
    //Do NOT modify this function
    public short getVoxel(int x, int y, int z) {
    	int i = x + dimX*(y + dimY * z);
        return data[i];
    }
    
    //Do NOT modify this function
    public void setVoxel(int x, int y, int z, short value) {
    	int i = x + dimX*(y + dimY * z);
        data[i] = value;
    }
    
	//Do NOT modify this function
    public void setVoxel(int i, short value) {
        data[i] = value;
    }
    
    //Do NOT modify this function
    public short getVoxel(int i) {
        return data[i];
    }
    
	//Do NOT modify this function
    public int getDimX() {
        return dimX;
    }
    
    //Do NOT modify this function
    public int getDimY() {
        return dimY;
    }
    
    //Do NOT modify this function
    public int getDimZ() {
        return dimZ;
    }

    //Do NOT modify this function
    public short getMinimum() {
        short minimum = data[0];
        for (int i=0; i<data.length; i++) {
            minimum = data[i] < minimum ? data[i] : minimum;
        }
        return minimum;
    }
    
    //Do NOT modify this function
    public short getMaximum() {
        short maximum = data[0];
        for (int i=0; i<data.length; i++) {
            maximum = data[i] > maximum ? data[i] : maximum;
        }
        return maximum;
    }
 
    //Do NOT modify this function
    public int[] getHistogram() {
        return histogram;
    }
    
    //Do NOT modify this function
    private void computeHistogram() {
        histogram = new int[getMaximum() + 1];
        for (int i=0; i<data.length; i++) {
            histogram[data[i]]++;
        }
    }
}
