import {create} from 'zustand'
import { axiosInstance } from '../lib/axios.js'
import toast from 'react-hot-toast'

export const useAuthStore = create((set)=>({
    authUser:null,
    isSigningUp:false,
    isLogginIn:false,
    isUpdatingProfile:false,
    isCheckingAuth:true,
    checkAuth: async()=>{
        try {
            const res = await axiosInstance.get("/auth/check")
            set({authUser:res.data})
        } catch (error) {
            console.log("Error in checkAuth",error.message);
            set({authUser:null})
        } finally{
            set({isCheckingAuth:false})
        }
    },

    signup: async(data)=>{
        set({isSigningUp:true});
        try {
            const res = await axiosInstance.post("/auth/signup",data);
            set({authUser:res.data});
            toast.success("Account created successfully");
        } catch (error) {
            toast.error(error.response.data.message)
            console.log("Error in signup in useAuthStore");
        }finally{
            set({isSigningUp:false});
        }
        
    },

    logout: async ()=>{
        try {
            await axiosInstance.post("/auth/logout");
            set({authUser:null})
            toast.success("Logged out successfully")
        } catch (error) {
            toast.error("Something went wrong");
            console.log(error.response.data.message);
        }
    }

}))
