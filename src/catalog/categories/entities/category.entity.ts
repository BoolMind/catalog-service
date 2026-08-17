import {
  Column,
  Entity,
  OneToMany,
} from 'typeorm';

import { AppBaseEntity } from '@ecommerce/common';

import { Product } from '../../products/entities';

@Entity('categories')
export class Category extends AppBaseEntity {
  @Column({
    type: 'varchar',
    length: 100,
    unique: true,
  })
  name!: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  description!: string | null;

  @OneToMany(
    () => Product,
    (product) => product.category,
  )
  products!: Product[];
}