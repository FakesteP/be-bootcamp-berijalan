export interface ICounterResponse{
  id: number;          
  name: string;        
  currentQueue: number; 
  maxQueue: number;     
  queues: number;       
  isActive: boolean;     
}