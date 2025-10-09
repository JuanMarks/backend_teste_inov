import { PartialType } from "@nestjs/swagger";
import { CreateChallengeDTO } from "./create-challenge.dto";

export class UpdateChallengeDTO extends PartialType(CreateChallengeDTO) {}