/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package util;

/**
 *
 * @author michel and modified by Anna Vilanova
 * 
 * Basic vector functionality used in the other elements
 * 
 * NO IMPLEMENTATION NEEDED FOR THE BASIC ASSIGNMENTME 
 */
public class VectorMath {

    // assign coefficients c0..c2 to vector v
    public static void setVector(double[] v, double c0, double c1, double c2) {
        v[0] = c0;
        v[1] = c1;
        v[2] = c2;
    }

    // compute dotproduct of vectors v and w
    public static double dotproduct(double[] v, double[] w) {
        double r = 0;
        for (int i=0; i<3; i++) {
            r += v[i] * w[i];
        }
        return r;
    }

    public static double toneCos(double[] v1, double[] v2) {
        if (length(v1) == 0 || length(v2) == 0) 
            return 0;
        double prod = dotproduct(v1, v2);
//        if (prod < 0) return 0;
        return prod/(length(v1)*length(v2));
    }

    
    // compute distance between vectors v and w
    public static double distance(double[] v, double[] w) {
        double[] tmp = new double[3];
        VectorMath.setVector(tmp, v[0]-w[0], v[1]-w[1], v[2]-w[2]);
        return Math.sqrt(VectorMath.dotproduct(tmp, tmp));
    }

    // compute dotproduct of v and w
    public static double[] crossproduct(double[] v, double[] w, double[] r) {
        r[0] = v[1] * w[2] - v[2] * w[1];
        r[1] = v[2] * w[0] - v[0] * w[2];
        r[2] = v[0] * w[1] - v[1] * w[0];
        return r;
    }
    
    // compute length of vector v
    public static double length(double[] v) {
        return Math.sqrt(v[0]*v[0] + v[1]*v[1] + v[2]*v[2]);
    }

    /**
     * Compute a scalar multiplication of vector
     */
    public static double[] scalar(double[] v, double scale){
        double[] result = new double[3];
        result[0] = v[0] * scale;
        result[1] = v[1] * scale;
        result[2] = v[2] * scale;

        return result;
    }

    /**
     * Compute a normalization of vector
     */
    public static double[] normalize(double[] vector){
        double[] result = new double[3];        
        double length = VectorMath.length(vector);

        if(length != 0){
            result[0] = vector[0] / length;
            result[1] = vector[1] / length;
            result[2] = vector[2] / length;
        }else{
            result[0] = 0;
            result[1] = 0;
            result[2] = 0;
        } 
        
        return result;
    }

    /**
     * Compute addition of vectors
     */
    public static double[] add(double[] v, double[] w){
        double[] result = new double[3];
        result[0] = v[0] + w[0];
        result[1] = v[1] + w[1];
        result[2] = v[2] + w[2];

        return result;
    }

    /**
     * Compute subtraction of vectors
     */
    public static double[] sub(double[] v, double[] w){
        double[] result = new double[3];
        result[0] = v[0] - w[0];
        result[1] = v[1] - w[1];
        result[2] = v[2] - w[2];

        return result;
    }



}
