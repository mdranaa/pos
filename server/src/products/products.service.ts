import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { EventsGateway } from '../events/events.gateway';

@Injectable()
export class ProductsService {
  constructor(
    private prisma: PrismaService,
    private eventsGateway: EventsGateway,
  ) {}

  async create(createProductDto: CreateProductDto) {
    const product = await this.prisma.product.create({
      data: createProductDto,
    });
    
    this.eventsGateway.notifyProductUpdate(product);
    return product;
  }

  async findAll() {
    return this.prisma.product.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });
    
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    
    return product;
  }

  async search(query: string) {
    return this.prisma.product.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { code: { contains: query, mode: 'insensitive' } },
        ],
      },
    });
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    try {
      const product = await this.prisma.product.update({
        where: { id },
        data: updateProductDto,
      });
      
      this.eventsGateway.notifyProductUpdate(product);
      return product;
    } catch (error) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
  }

  async remove(id: string) {
    try {
      const product = await this.prisma.product.delete({
        where: { id },
      });
      
      this.eventsGateway.notifyProductUpdate(product);
      return product;
    } catch (error) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
  }

  async updateStock(id: string, quantity: number) {
    try {
      const product = await this.prisma.product.findUnique({
        where: { id },
      });
      
      if (!product) {
        throw new NotFoundException(`Product with ID ${id} not found`);
      }
      
      if (product.stockQty < quantity) {
        throw new Error(`Insufficient stock for product ${product.name}`);
      }
      
      const updatedProduct = await this.prisma.product.update({
        where: { id },
        data: {
          stockQty: {
            decrement: quantity,
          },
        },
      });
      
      this.eventsGateway.notifyProductUpdate(updatedProduct);
      return updatedProduct;
    } catch (error) {
      throw error;
    }
  }
}