import {create} from "zustand"
import toast from "react-hot-toast"
import { axiosInstance } from "../lib/axios"


export const useChatStore = create((set,get)=>({
    messages:[],
    users:[],
    selectedUser:null,
    isUsersLoading:false,
    isMessagesLoading:false,

    getUsers: async()=>{
        set({isUsersLoading:true})
        try {
            const res = await axiosInstance.get("/message/users");
            set({users:res.data});
        } catch (error) {
            toast.error("Something went wrong in fetching users")
            console.log(error.response.data.message);
        }finally{
            set({isUsersLoading:false})
        }
    },

    getMessages: async(userId)=>{
        set({isMessagesLoading:true});
        try {
            const res = await axiosInstance.get(`/message/${userId}`);
            set({messages:res.data})
        } catch (error) {
            toast.error("Something went wrong in fetching messages");
            console.log(error.response.data.message);
        }finally{
            set({isMessagesLoading:false});
        }
    },
    sendMessage: async(messageData)=>{
        const {selectedUser, messages} = get();
        try {
            const res = await axiosInstance.post(`/message/send/${selectedUser._id}`,messageData);
            set({messages:[...messages,res.data]});

        } catch (error) {
            toast.error("Something went wrong with sending the message");
            console.log(error.response.data.message);
        }
    },
    //todo optimize this one later
    setSelectedUser: (selectedUser)=> set({selectedUser}),
}))