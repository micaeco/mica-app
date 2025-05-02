"use server";

import { Consumption } from "@domain/entities/consumption";
import { ErrorKey } from "@domain/entities/error";
import { Tag } from "@domain/entities/tag";
import { MockConsumptionRepository } from "@infra/repositories/consumption.mock";
import { MockEventRepository } from "@infra/repositories/event.mock";
import { MockTagRepository } from "@infra/repositories/tag.mock";

async function getHouseholdTags(
  householdId: string
): Promise<{ success: true; data: Tag[] } | { success: false; error: ErrorKey }> {
  try {
    const tagRepo = new MockTagRepository();

    const tags = await tagRepo.getHouseholdTags(householdId);

    return { success: true, data: tags };
  } catch (error) {
    console.error(error);
    return { success: false, error: "INTERNAL_SERVER_ERROR" };
  }
}

async function createHouseholdTag(
  tag: Tag
): Promise<{ success: true; data: Tag } | { success: false; error: ErrorKey }> {
  try {
    const tagRepo = new MockTagRepository();

    const createdTag = await tagRepo.create(tag);

    return { success: true, data: createdTag };
  } catch (error) {
    console.error(error);
    return { success: false, error: "INTERNAL_SERVER_ERROR" };
  }
}

async function getNumberOfLeakEvents(
  householdId: string
): Promise<{ success: true; data: number } | { success: false; error: ErrorKey }> {
  try {
    const eventRepo = new MockEventRepository();

    const leaks = await eventRepo.getNumberOfLeakEvents(householdId);

    return { success: true, data: leaks };
  } catch (error) {
    console.error(error);
    return { success: false, error: "INTERNAL_SERVER_ERROR" };
  }
}

async function getNumberOfUnknownEvents(
  householdId: string
): Promise<{ success: true; data: number } | { success: false; error: ErrorKey }> {
  try {
    const eventRepo = new MockEventRepository();

    const unknowns = await eventRepo.getNumberOfUnknownEvents(householdId);

    return { success: true, data: unknowns };
  } catch (error) {
    console.error(error);
    return { success: false, error: "INTERNAL_SERVER_ERROR" };
  }
}

async function getCurrentMonthConsumption(
  householdId: string
): Promise<{ success: true; data: Consumption } | { success: false; error: ErrorKey }> {
  try {
    const consumptionRepo = new MockConsumptionRepository();

    const consumption = await consumptionRepo.getCurrentMonthConsumption(householdId);

    return { success: true, data: consumption };
  } catch (error) {
    console.error(error);
    return { success: false, error: "INTERNAL_SERVER_ERROR" };
  }
}

async function getCurrentDayConsumption(
  householdId: string
): Promise<{ success: true; data: Consumption } | { success: false; error: ErrorKey }> {
  try {
    const consumptionRepo = new MockConsumptionRepository();

    const consumption = await consumptionRepo.getCurrentDayConsumption(householdId);

    return { success: true, data: consumption };
  } catch (error) {
    console.error(error);
    return { success: false, error: "INTERNAL_SERVER_ERROR" };
  }
}

export {
  getHouseholdTags,
  createHouseholdTag,
  getNumberOfLeakEvents,
  getNumberOfUnknownEvents,
  getCurrentMonthConsumption,
  getCurrentDayConsumption,
};
