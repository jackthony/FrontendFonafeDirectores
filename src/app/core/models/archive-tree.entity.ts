/*******************************************************************************************************
 * Nombre del archivo:  file-folder.interface.ts
 * Descripción:          Interfaces que definen la estructura de los datos de archivos y carpetas utilizados
 *                       en el sistema de gestión de archivos. Estas interfaces permiten representar tanto 
 *                       los archivos como las carpetas, incluyendo sus metadatos asociados.
 *                       Estas interfaces son esenciales para trabajar con el almacenamiento de archivos
 *                       y carpetas en el sistema, ya sea para visualización, subida, descarga, o gestión.
 * Autor:                Daniel Alva
 * Fecha de creación:    01/07/2025
 * Última modificación:  09/07/2025 por Daniel Alva
 * Cambios recientes:    - Implementación inicial de las interfaces para la gestión de archivos y carpetas.
 *******************************************************************************************************/
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