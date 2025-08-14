import { CreateCandidateRequest } from "./create-candidate.entity";
import { CreateFormationRequest } from "./create-formation.entity";
import { CreateTrainingRequest } from "./create-training.entity";
import { WorkExperienceRequest } from "./work-experience.entity";

export interface CreateRequestEntity {
    CrearCandidatoRequest: CreateCandidateRequest;
    Formaciones: CreateFormationRequest[];
    ExperienciasLaborales: WorkExperienceRequest[];
    Capacitaciones: CreateTrainingRequest[];

}