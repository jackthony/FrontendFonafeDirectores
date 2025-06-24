/*******************************************************************************************************
 * Archivo de rutas: business-management.routes.ts
 * Descripción:       Define las rutas del módulo de Gestión Empresarial. Incluye navegación hacia el
 *                    componente principal y el formulario de registro/edición de empresas. Utiliza 
 *                    `businessResolver` para precargar datos antes de mostrar el formulario.
 * Autor:             Daniel Alva
 * Fecha de creación: 23/06/2025
 * Última modificación: 23/06/2025 por Daniel Alva
 * Cambios recientes: - Configuración de rutas con y sin parámetro para reuso del formulario.
 *                    - Aplicación de resolver para cargar datos al editar.
 *******************************************************************************************************/
import { Routes } from '@angular/router';
import { BusinessManagementComponent } from './components/business-management/business-management.component';
import { BusinessFormComponent } from './components/business-form/business-form.component';
import { businessResolver } from './infrastructure/resolvers/business.resolver';
export default [
    {
        path     : '',
        component: BusinessManagementComponent,
    },
    {
        path     : 'registro',
        component: BusinessFormComponent,
        resolve: {
            data: businessResolver
        }
    },
    {
        path     : 'registro/:id',
        component: BusinessFormComponent,
        resolve: {
            data: businessResolver
        }
    },
] as Routes;
