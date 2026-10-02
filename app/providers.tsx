 "use client";
import React, {createContext,useContext,useEffect,useState} from "react";

type User={name:string;email:string;role:"worker"|"admin"};
type Ctx={
 user:User|null; login:(email:string,password:string)=>boolean; signup:(name:string,email:string,password:string)=>boolean;
 logout:()=>void; tasksDone:number; setTasksDone:React.Dispatch<React.SetStateAction<number>>;
 balance:number; setBalance:React.Dispatch<React.SetStateAction<number>>;
 transactions:{type:string;amount:number;status:string;date:string}[];
 addTransaction:(t:{type:string;amount:number;status:string})=>void;
};

const C= createContext<Ctx|null>(null);

export function AppProvider({children}:{children:React.ReactNode}){
 const [user,setUser]=useState<User|null>(null);
 const [tasksDone,setTasksDone]=useState(0);
 const [balance,setBalance]=useState(0);
 const [transactions,setTransactions]=useState<{type:string;amount:number;status:string;date:string}[]>([
  {type:"Task earnings",amount:8.50,status:"Completed",date:"Today"},
  {type:"Task earnings",amount:5.00,status:"Completed",date:"Yesterday"}
 ]);
 useEffect(()=>{try{const s=localStorage.getItem("ss_user");if(s)setUser(JSON.parse(s))}catch{}},[]);
 const login=(email:string,password:string)=>{if(!email||!password)return false;const u:User={name:email.split("@")[0].replace(/[._-]/g," "),email,role:email.toLowerCase().includes("admin")?"admin":"worker"};setUser(u);localStorage.setItem("ss_user",JSON.stringify(u));return true};
 const signup=(name:string,email:string,password:string)=>{if(!name||!email||!password)return false;const u:User={name,email,role:"worker"};setUser(u);localStorage.setItem("ss_user",JSON.stringify(u));return true};
 const logout=()=>{setUser(null);localStorage.removeItem("ss_user")};
 const addTransaction=(t:{type:string;amount:number;status:string})=>setTransactions(x=>[{...t,date:"Just now"},...x]);
 return <C.Provider value={{user,login,signup,logout,tasksDone,setTasksDone,balance,setBalance,transactions,addTransaction}}>{children}</C.Provider>
}
export function useApp(){const x=useContext(C);if(!x)throw new Error("useApp must be used inside AppProvider");return x}
