import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import * as bcrypt from 'bcrypt';

import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) { }

  async register(email: string, password: string): Promise<User> {
    // Genera una sal criptográfica utilizando bcrypt
    const salt = await bcrypt.genSalt();

    // Crea un hash de la contraseña proporcionada utilizando la sal generada
    const hashedPassword = await bcrypt.hash(password, salt);

    // Crea una nueva instancia de usuario con el email y la contraseña encriptada
    const user = this.usersRepository.create({ email, password: hashedPassword });

    // Guarda la instancia del usuario en la base de datos y devuelve el usuario guardado
    return this.usersRepository.save(user);
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { email } });
  }
}

