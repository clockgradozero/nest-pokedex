import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { PokeResponse } from './interfaces/poke-response.interface';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';

import { AxiosAdapter } from 'src/common/adapters/axios.adapter';

@Injectable()
export class SeedService {

  

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
    private readonly http: AxiosAdapter
    
    //private readonly axios: AxiosInstance = axios;
  ) {}  

  /*async executeSeed() {

    await this.pokemonModel.deleteMany({});

    const {data} = await this.axios.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=10');

    //Inserta todas las promesas en un array
    const insertPromisesArray: Promise<Pokemon>[] = [];

    data.results.forEach(({name, url}) => {

      const segments = url.split('/');
      const no:number = +segments[segments.length - 2];

      //const pokemon = await this.pokemonModel.create({name, no});

      insertPromisesArray.push(
        this.pokemonModel.create({name, no})
      );

    });

    await Promise.all(insertPromisesArray);

    return 'Seed execute';
  }*/
  
  async executeSeed() {

    await this.pokemonModel.deleteMany({});

    const data = await this.http.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=650');

    //Inserta todas las promesas en un array
    const pokemonToInsert: { name:string, no:number }[] = [];

    data.results.forEach(({name, url}) => {

      const segments = url.split('/');
      const no:number = +segments[segments.length - 2];

      pokemonToInsert.push(
        {name, no}
      );

    });

    await this.pokemonModel.insertMany(pokemonToInsert);

    return 'Seed execute';
  }

}
