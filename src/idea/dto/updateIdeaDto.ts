import { PartialType } from "@nestjs/swagger";
import { CreateIdeaDto } from "./createIdeaDto";


export class UpdateIdeaDto extends PartialType(CreateIdeaDto){}