<script setup lang="ts">
import { computed } from 'vue'
import { useGetKpis } from '@/modules/analytics/ui/hooks/queries/query/use-get-kpis'
import { useGetMonthlyRevenue } from '@/modules/analytics/ui/hooks/queries/query/use-get-monthly-revenue'
import { useGetSalesDistribution } from '@/modules/analytics/ui/hooks/queries/query/use-get-sales-distribution'
import { useGetRecentOrders } from '@/modules/analytics/ui/hooks/queries/query/use-get-recent-orders'
import { useGetTopProducts } from '@/modules/analytics/ui/hooks/queries/query/use-get-top-products'
import { useGetTopClients } from '@/modules/analytics/ui/hooks/queries/query/use-get-top-clients'
import KpiCards from '@/modules/analytics/ui/components/kpi-cards.vue'
import MonthlyRevenueChart from '@/modules/analytics/ui/components/monthly-revenue-chart.vue'
import SalesDistributionChart from '@/modules/analytics/ui/components/sales-distribution-chart.vue'
import RecentOrdersTable from '@/modules/analytics/ui/components/recent-orders-table.vue'
import TopProductsCard from '@/modules/analytics/ui/components/top-products-card.vue'
import TopClientsCard from '@/modules/analytics/ui/components/top-clients-card.vue'

const { data: kpis, isLoading: kpisLoading } = useGetKpis()
const { data: monthlyRevenue, isLoading: revenueLoading } = useGetMonthlyRevenue()
const { data: salesDistribution, isLoading: distributionLoading } = useGetSalesDistribution()
const { data: recentOrders, isLoading: ordersLoading } = useGetRecentOrders()
const { data: topProducts, isLoading: productsLoading } = useGetTopProducts()
const { data: topClients, isLoading: clientsLoading } = useGetTopClients()

const isLoading = computed(() => kpisLoading.value || revenueLoading.value || distributionLoading.value || ordersLoading.value || productsLoading.value || clientsLoading.value)

const now = new Date()
const dateLabel = now.toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
</script>

<template>
  <div class="p-6">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="font-heading text-[28px] font-bold text-font-primary">Tableau de bord</h1>
        <p class="text-sm font-body text-font-secondary mt-1 capitalize">{{ dateLabel }}</p>
      </div>
    </div>

    <p v-if="isLoading" class="font-body text-sm text-font-secondary py-10 text-center">Chargement...</p>

    <template v-else>
      <div class="mb-6" v-if="kpis">
        <KpiCards :kpis="kpis" />
      </div>

      <div class="grid lg:grid-cols-[1fr_340px] gap-6 mb-6">
        <MonthlyRevenueChart v-if="monthlyRevenue" :monthly-revenue="monthlyRevenue" />
        <SalesDistributionChart v-if="salesDistribution" :sales-distribution="salesDistribution" />
      </div>

      <div class="mb-6" v-if="recentOrders">
        <RecentOrdersTable :recent-orders="recentOrders" />
      </div>

      <div class="grid lg:grid-cols-2 gap-6">
        <TopProductsCard v-if="topProducts" :top-products="topProducts" />
        <TopClientsCard v-if="topClients" :top-clients="topClients" />
      </div>
    </template>
  </div>
</template>
