import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CinemaRoom } from '../typeorm/entities/cinema/cinema-room';
import { CreateCinemaRoomDto } from './dto/create-cinema-room.dto';
import { UpdateCinemaRoomDto } from './dto/update-cinema-room.dto';

@Injectable()
export class CinemaRoomService {
  constructor(
    @InjectRepository(CinemaRoom)
    private readonly cinemaRoomRepository: Repository<CinemaRoom>,
  ) {}

  async create(createCinemaRoomDto: CreateCinemaRoomDto): Promise<CinemaRoom> {
    const existing = await this.cinemaRoomRepository.findOne({
      where: { cinema_room_name: createCinemaRoomDto.cinema_room_name },
    });
    if (existing) {
      throw new BadRequestException('Tên phòng chiếu đã tồn tại');
    }
    const cinemaRoom = this.cinemaRoomRepository.create(createCinemaRoomDto);
    return await this.cinemaRoomRepository.save(cinemaRoom);
  }

  async findAll(): Promise<CinemaRoom[]> {
    return await this.cinemaRoomRepository.find();
  }

  async findOne(id: number): Promise<CinemaRoom> {
    const cinemaRoom = await this.cinemaRoomRepository.findOne({
      where: { id },
    });
    if (!cinemaRoom) {
      throw new NotFoundException(`Cinema room with ID ${id} not found`);
    }
    return cinemaRoom;
  }

  async update(
    id: number,
    updateCinemaRoomDto: UpdateCinemaRoomDto,
  ): Promise<CinemaRoom> {
    const existing = await this.cinemaRoomRepository.findOne({
      where: { cinema_room_name: updateCinemaRoomDto.cinema_room_name },
    });
    if (existing) {
      throw new BadRequestException('Tên phòng chiếu đã tồn tại');
    }
    const cinemaRoom = await this.findOne(id);
    Object.assign(cinemaRoom, updateCinemaRoomDto);
    return await this.cinemaRoomRepository.save(cinemaRoom);
  }

  async remove(id: number): Promise<void> {
    const cinemaRoom = await this.findOne(id);
    await this.cinemaRoomRepository.remove(cinemaRoom);
  }
}
