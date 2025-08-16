import { CandidateEntity } from "./candidate.entity";
import { TrainingRequestEntity } from "./training-request.entity";
import { FormationCandidateEntity } from "./formation-candidate.entity";
import { WorkExperienceEntity } from "./work-experience.entity";

export interface CreateRequestEntity {
    crearCandidatoRequest: CandidateEntity;
    formaciones: FormationCandidateEntity[];
    experienciasLaborales: WorkExperienceEntity[];
    capacitaciones: TrainingRequestEntity[];

}