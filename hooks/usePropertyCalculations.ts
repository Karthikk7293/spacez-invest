
import { useState, useEffect, useCallback } from 'react';
import { Property, CapexDetails, OpexDetails, RevenueAssumptions, CalculatedMetrics, ROIProjectionItem } from '../types';
import { GST_RATE, COMMISSION_RATE, INVESTOR_PROFIT_SHARE_RATE, PROJECTION_YEARS } from '../constants';

interface UsePropertyCalculationsProps {
  capexDetails: CapexDetails;
  opexDetails: OpexDetails;
  revenueAssumptions: RevenueAssumptions;
}

export function usePropertyCalculations(props: UsePropertyCalculationsProps): CalculatedMetrics | null {
  const { capexDetails, opexDetails, revenueAssumptions } = props;
  const [metrics, setMetrics] = useState<CalculatedMetrics | null>(null);

  const calculateAllMetrics = useCallback((): CalculatedMetrics | null => {
    try {
      const totalCapex =
        (capexDetails.setupCost || 0) +
        (capexDetails.securityDeposit || 0) +
        (capexDetails.workingCapital || 0) +
        (capexDetails.emergencyFund || 0);

      const totalOpexMonthly =
        (opexDetails.rent || 0) +
        (opexDetails.staff || 0) +
        (opexDetails.foodStaff || 0) +
        (opexDetails.utilities || 0) +
        (opexDetails.maintenance || 0) +
        (opexDetails.otherOperatingCosts || 0); // Include otherOperatingCosts
      
      const annualOpex = totalOpexMonthly * 12;

      const numRooms = revenueAssumptions?.numberOfRooms || 0;
      // Removed reserveSlots
      const tariff = revenueAssumptions?.tariffPerRoom || 0;
      const occupancy = Math.max(0, Math.min(1, revenueAssumptions?.occupancyRate || 0));

      const rentableRooms = Math.max(0, numRooms); // All rooms are rentable
      
      const monthlyGrossRevenue =
        tariff *
        occupancy *
        rentableRooms *
        30; // Assuming 30 days per month for simplicity

      const monthlyGstAmount = monthlyGrossRevenue * GST_RATE;
      const monthlyCommissionAmount = monthlyGrossRevenue * COMMISSION_RATE;
      const monthlyNetRevenue = monthlyGrossRevenue - monthlyGstAmount - monthlyCommissionAmount;
      const annualNetRevenue = monthlyNetRevenue * 12;
      const annualNetProfit = annualNetRevenue - annualOpex;
      const annualInvestorShare = annualNetProfit * INVESTOR_PROFIT_SHARE_RATE;
      const monthlyInvestorShare = annualInvestorShare / 12;

      const roiProjections: ROIProjectionItem[] = [];
      let cumulativeReturnPercentage = 0;
      for (let i = 1; i <= PROJECTION_YEARS; i++) {
        const annualReturnPercentage = totalCapex > 0 ? (annualInvestorShare / totalCapex) * 100 : 0;
        cumulativeReturnPercentage += annualReturnPercentage;
        roiProjections.push({
          year: i,
          annualReturnPercentage: parseFloat(annualReturnPercentage.toFixed(2)),
          cumulativeReturnPercentage: parseFloat(cumulativeReturnPercentage.toFixed(2)),
          annualInvestorShareAmount: parseFloat(annualInvestorShare.toFixed(2)),
        });
      }
      
      return {
        totalCapex: parseFloat(totalCapex.toFixed(2)),
        totalOpexMonthly: parseFloat(totalOpexMonthly.toFixed(2)),
        annualOpex: parseFloat(annualOpex.toFixed(2)),
        monthlyGrossRevenue: parseFloat(monthlyGrossRevenue.toFixed(2)),
        monthlyGstAmount: parseFloat(monthlyGstAmount.toFixed(2)),
        monthlyCommissionAmount: parseFloat(monthlyCommissionAmount.toFixed(2)),
        monthlyNetRevenue: parseFloat(monthlyNetRevenue.toFixed(2)),
        annualNetRevenue: parseFloat(annualNetRevenue.toFixed(2)),
        annualNetProfit: parseFloat(annualNetProfit.toFixed(2)),
        annualInvestorShare: parseFloat(annualInvestorShare.toFixed(2)),
        monthlyInvestorShare: parseFloat(monthlyInvestorShare.toFixed(2)),
        roiProjections,
        rentableRooms, 
      };
    } catch (error) {
      console.error("Error calculating metrics:", error);
      return null;
    }
  }, [capexDetails, opexDetails, revenueAssumptions]);

  useEffect(() => {
    if (capexDetails && opexDetails && revenueAssumptions && 
        typeof revenueAssumptions.numberOfRooms === 'number' &&
        typeof revenueAssumptions.tariffPerRoom === 'number' &&
        typeof revenueAssumptions.occupancyRate === 'number') { // reserveSlots check removed
        setMetrics(calculateAllMetrics());
    } else {
        setMetrics(null);
    }
  }, [calculateAllMetrics, capexDetails, opexDetails, revenueAssumptions]);

  return metrics;
}

export const getInitialCalculatedMetrics = (property: Property): CalculatedMetrics | undefined => {
   try {
      const capexDetails = property.capexDetails;
      const opexDetails = property.opexDetails;
      const revenueAssumptions = property.revenueAssumptions;

      const totalCapex = (capexDetails.setupCost || 0) + (capexDetails.securityDeposit || 0) + (capexDetails.workingCapital || 0) + (capexDetails.emergencyFund || 0);
      const totalOpexMonthly = (opexDetails.rent || 0) + (opexDetails.staff || 0) + (opexDetails.foodStaff || 0) + (opexDetails.utilities || 0) + (opexDetails.maintenance || 0) + (opexDetails.otherOperatingCosts || 0);
      const annualOpex = totalOpexMonthly * 12;
      const rentableRooms = Math.max(0, (revenueAssumptions.numberOfRooms || 0)); // All rooms are rentable
      const occupancy = Math.max(0, Math.min(1, revenueAssumptions.occupancyRate || 0));
      const monthlyGrossRevenue = (revenueAssumptions.tariffPerRoom || 0) * occupancy * rentableRooms * 30;
      const monthlyGstAmount = monthlyGrossRevenue * GST_RATE;
      const monthlyCommissionAmount = monthlyGrossRevenue * COMMISSION_RATE;
      const monthlyNetRevenue = monthlyGrossRevenue - monthlyGstAmount - monthlyCommissionAmount;
      const annualNetRevenue = monthlyNetRevenue * 12;
      const annualNetProfit = annualNetRevenue - annualOpex;
      const annualInvestorShare = annualNetProfit * INVESTOR_PROFIT_SHARE_RATE;
      const monthlyInvestorShare = annualInvestorShare / 12;
      const roiProjections: ROIProjectionItem[] = [];
      let cumulativeReturnPercentage = 0;
      for (let i = 1; i <= PROJECTION_YEARS; i++) {
        const annualReturnPercentage = totalCapex > 0 ? (annualInvestorShare / totalCapex) * 100 : 0;
        cumulativeReturnPercentage += annualReturnPercentage;
        roiProjections.push({
          year: i,
          annualReturnPercentage: parseFloat(annualReturnPercentage.toFixed(2)),
          cumulativeReturnPercentage: parseFloat(cumulativeReturnPercentage.toFixed(2)),
          annualInvestorShareAmount: parseFloat(annualInvestorShare.toFixed(2)),
        });
      }
      return {
        totalCapex: parseFloat(totalCapex.toFixed(2)), totalOpexMonthly: parseFloat(totalOpexMonthly.toFixed(2)), annualOpex: parseFloat(annualOpex.toFixed(2)),
        monthlyGrossRevenue: parseFloat(monthlyGrossRevenue.toFixed(2)), monthlyGstAmount: parseFloat(monthlyGstAmount.toFixed(2)), monthlyCommissionAmount: parseFloat(monthlyCommissionAmount.toFixed(2)),
        monthlyNetRevenue: parseFloat(monthlyNetRevenue.toFixed(2)), annualNetRevenue: parseFloat(annualNetRevenue.toFixed(2)), annualNetProfit: parseFloat(annualNetProfit.toFixed(2)),
        annualInvestorShare: parseFloat(annualInvestorShare.toFixed(2)), monthlyInvestorShare: parseFloat(monthlyInvestorShare.toFixed(2)), roiProjections, rentableRooms
      };
    } catch (error) {
      console.error("Error calculating initial metrics:", error);
      return undefined;
    }
};