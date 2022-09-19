import { Injectable } from '@nestjs/common';
import { Restaurant } from './entities/restaurant.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';

@Injectable()
export class RestaurantsService {
  constructor(
    @InjectRepository(Restaurant)
    private readonly restaurants: Repository<Restaurant>,
  ) {}

  getAll = (): Promise<Restaurant[]> => {
    return this.restaurants.find();
  };

  createRestaurant = (
    createRestaurantDto: CreateRestaurantDto,
  ): Promise<Restaurant> => {
    // create new restaurant in memory
    const newRestaurant = this.restaurants.create(createRestaurantDto);
    // save new restaurant in DB
    return this.restaurants.save(newRestaurant);
  };
}
