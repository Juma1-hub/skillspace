import {Page,Guard} from "../components";
import TasksClient from "./client";
export default function Tasks({searchParams}:{searchParams:{category?:string}}){return <Guard><Page><div className="sectionHead"><div><h2>Task marketplace</h2><p className="muted">Choose a task that matches your skills.</p></div></div><TasksClient category={searchParams.category}/></Page></Guard>}