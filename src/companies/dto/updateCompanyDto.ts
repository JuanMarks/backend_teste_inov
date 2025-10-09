import { PartialType } from "@nestjs/swagger";
import { CreateCompanyDTO } from "./createCompanyDto";

export class UpdateCompany extends PartialType(CreateCompanyDTO) {}