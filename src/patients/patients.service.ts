import { Injectable, NotFoundException } from '@nestjs/common'; import { InjectModel } from '@nestjs/mongoose'; import { Model } from 'mongoose'; import { Patient, PatientDocument } from './schemas/patient.schema';
@Injectable() export class PatientsService {
 constructor(@InjectModel(Patient.name) private model:Model<PatientDocument>){}
 async me(userId:string){const p=await this.model.findOne({user:userId}).populate('user','email role');if(!p)throw new NotFoundException('Patient profile not found');return p;}
 async update(userId:string,dto:Record<string,unknown>){const p=await this.model.findOneAndUpdate({user:userId},{$set:dto},{new:true,runValidators:true}).populate('user','email role');if(!p)throw new NotFoundException('Patient profile not found');return p;}
}
