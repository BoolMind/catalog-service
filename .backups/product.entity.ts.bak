import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

import { AppBaseEntity } from '@ecommerce/common';

import { Category } from '../../categories/entities';

@Entity('products')
export class Product extends AppBaseEntity {
  @Column({
    type: 'varchar',
    length: 150,
  })
  @Index()
  name!: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  description!: string | null;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => Number(value),
    },
  })
  price!: number;

  @Column({
    type: 'int',
  })
  @Index()
  userId!: number;

  @Column({
    type: 'int',
  })
  @Index()
  categoryId!: number;

  @ManyToOne(
    () => Category,
    (category) => category.products,
    {
      nullable: false,
      eager: false,
      onDelete: 'RESTRICT',
    },
  )
  @JoinColumn({
    name: 'categoryId',
  })
  category!: Category;
}
