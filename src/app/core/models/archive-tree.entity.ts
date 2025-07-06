export interface FileData {
    tipo: number;                  
    nPeso: number;                 
    sTipoMime: string;             
    sUrlStorage: string;           
    bEsDocumento: boolean;         
    nElementoId: number;           
    sNombre: string;               
    nCarpetaPadreId: number | null;
    nEmpresaId: number;            
    nUsuarioRegistroId: number;    
    dtFechaRegistro: string;       
}
  
export interface FolderData {
    tipo: number;                 
    ltHijos: FileData[];          
    bEsDocumento: boolean;        
    nElementoId: number;          
    sNombre: string;              
    nCarpetaPadreId: number | null;
    nEmpresaId: number;            
    nUsuarioRegistroId: number;    
    dtFechaRegistro: string;       
}