import CounterApp from './CounterApp';
import { getDashboardData } from '@/features/dashboard/service';
import { getCategoriesService } from '@/features/categories/service';
import { getProductsService } from '@/features/products/service';
import { getCustomersService } from '@/features/customers/service';
import { getReportsService } from '@/features/reports/service';
import { getOrdersService } from '@/features/orders/service';
import { getUsersService } from '@/features/users/service';

export default async function Page() {
  const [dashboardData, categoriesData, productsData, customersData, reportsData, ordersData, usersData] = await Promise.all([
    getDashboardData(),
    getCategoriesService(),
    getProductsService(),
    getCustomersService(),
    getReportsService('7days'),
    getOrdersService(),
    getUsersService(),
  ]);

  return (
    <CounterApp
      dashboardData={dashboardData}
      categoriesData={categoriesData}
      productsData={productsData}
      customersData={customersData}
      reportsData={reportsData}
      ordersData={ordersData}
      usersData={usersData}
    />
  );
}
