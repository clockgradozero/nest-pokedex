import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, Query } from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { isValidObjectId, Model } from 'mongoose';
import { Pokemon } from './entities/pokemon.entity';
import { InjectModel } from '@nestjs/mongoose';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PokemonService {

  private defaultLimit: number;

  constructor(

    //Sirve para inyectar modelos por NEST
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
    private readonly configService: ConfigService

  ){
    this.defaultLimit = configService.get<number>('defaultLimit')!;
  }

  async create(createPokemonDto: CreatePokemonDto) {
    
    //Pasamos a minisculas
    createPokemonDto.name = createPokemonDto.name.toLocaleLowerCase();

    try {

      //Esta linea inserta en el modelo/coleccion de mongo
      const pokemon = await this.pokemonModel.create(createPokemonDto);
      return pokemon;

    } catch (error) {
      this.handledExceptions(error);
    }

  }

  async findAll(paginationDto: PaginationDto) {

    const { limit = this.defaultLimit, offset = 0 } = paginationDto; 
    //const { limit = +process.env.DEFAULT_LIMIT!, offset = 0 } = paginationDto; 
    
    const pokemons = await this.pokemonModel.find()
    .limit(limit)
    .skip(offset)
    .sort({ no: 1 })
    .select('-__v');

    return pokemons;  
  }

  async findOne(value: string) {
    let condition: object = { name: value };
 
    if (!Number.isNaN(+value)) {
      condition = { no: value };
    } else if (isValidObjectId(value)) {
      condition = { _id: value };
    }
 
    const pokemon = await this.pokemonModel.findOne(condition);
    if (!pokemon) {
      throw new NotFoundException(
        `Pokemon with ${JSON.stringify(condition)} not found`,
      );
    }
 
    return pokemon;
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {

    const pokemon = await this.findOne(term);
    if( updatePokemonDto.name )
        updatePokemonDto.name = updatePokemonDto.name.toLowerCase();

    try {

      await pokemon.updateOne( updatePokemonDto );
      return { ...pokemon.toJSON(), ...updatePokemonDto };

    } catch (error) {

      this.handledExceptions(error);
      
    }

  }

  /*async remove(id: string) {
    const pokemon = await this.findOne(id);
    await pokemon.deleteOne();

    //Este busca y borra al mismo tiempo
    //this.pokemonModel.findByIdAndDelete(id);
  }*/

  async remove(id: string) {
    
    const result = await this.pokemonModel.deleteOne({_id: id});
    if(result.deletedCount === 0){
      throw new NotFoundException(`Pokemon with id ${id} not found`);
    }
    return result;
  }

  private handledExceptions(error: any) {
    if(error.code === 11000){
      throw new BadRequestException(`Pokemon exists in db ${ JSON.stringify( error.keyValue) }`);
    }
    console.log(error);
    throw new InternalServerErrorException(`Can't create Pokemon - Check server logs`);
  }

}
