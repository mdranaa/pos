import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ProductsService } from '../products/products.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { EventsGateway } from '../events/events.gateway';

interface SaleItem {
  productId: string;
  quantity: number;
  price: number;
  subtotal: number;
}

@Injectable()
export class SalesService {
  constructor(
    private prisma: PrismaService,
    private productsService: ProductsService,
    private eventsGateway: EventsGateway
  ) {}

  async create(createSaleDto: CreateSaleDto) {
    if (!createSaleDto.items.length) {
      throw new BadRequestException('Sale must have at least one item');
    }

    return this.prisma.$transaction(async (prisma) => {
      // Calculate total and prepare items
      let total = 0;
      const saleItems: SaleItem[] = [];

      for (const item of createSaleDto.items) {
        // Get product to verify stock and price
        const product = await this.productsService.findOne(item.productId);

        // Check if enough stock is available
        if (product.stockQty < item.quantity) {
          throw new BadRequestException(
            `Insufficient stock for product ${product.name}`
          );
        }

        // Calculate subtotal for this item
        const subtotal = item.price * item.quantity;
        total += subtotal;

        // Add to sale items
        saleItems.push({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
          subtotal
        });

        // Update product stock
        await this.productsService.updateStock(item.productId, item.quantity);
      }

      // Create the sale with its items
      const sale = await this.prisma.sale.create({
        data: {
          total,
          items: {
            create: saleItems
          }
        },
        include: {
          items: {
            include: {
              product: true
            }
          }
        }
      });

      this.eventsGateway.notifySaleCreated(sale);
      return sale;
    });
  }

  async findAll() {
    return this.prisma.sale.findMany({
      include: {
        items: {
          include: {
            product: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  async findOne(id: string) {
    return this.prisma.sale.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    });
  }
}
