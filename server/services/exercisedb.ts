/**
 * ExerciseDB API Service
 * 
 * Fetches exercise data from ExerciseDB via RapidAPI.
 * Includes rate limiting, retry logic, and batch support.
 * 
 * Required environment variables:
 * - EXERCISEDB_API_KEY: Your RapidAPI key
 * - EXERCISEDB_API_HOST: API host (default: exercisedb.p.rapidapi.com)
 */

import { ExerciseDBExercise } from "../../shared/types/exercise";

// API Configuration
const API_HOST = process.env.EXERCISEDB_API_HOST || "exercisedb.p.rapidapi.com";
const API_BASE_URL = `https://${API_HOST}`;

// Rate limiting settings
const RATE_LIMIT_DELAY_MS = 100; // Delay between requests
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;

/**
 * Sleep utility for rate limiting
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Get API headers with authentication
 */
function getHeaders(): Record<string, string> {
  const apiKey = process.env.EXERCISEDB_API_KEY;
  if (!apiKey) {
    throw new Error("EXERCISEDB_API_KEY environment variable is not set");
  }

  return {
    "x-rapidapi-key": apiKey,
    "x-rapidapi-host": API_HOST,
  };
}

/**
 * Fetch with retry logic
 */
async function fetchWithRetry(
  url: string,
  options: RequestInit,
  retries = MAX_RETRIES
): Promise<Response> {
  try {
    const response = await fetch(url, options);
    
    if (!response.ok) {
      // Handle rate limiting (429)
      if (response.status === 429 && retries > 0) {
        console.log(`[exercisedb] Rate limited, retrying in ${RETRY_DELAY_MS}ms...`);
        await sleep(RETRY_DELAY_MS);
        return fetchWithRetry(url, options, retries - 1);
      }
      
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    return response;
  } catch (error) {
    if (retries > 0) {
      console.log(`[exercisedb] Request failed, retrying (${retries} left)...`);
      await sleep(RETRY_DELAY_MS);
      return fetchWithRetry(url, options, retries - 1);
    }
    throw error;
  }
}

/**
 * Fetch all exercises from ExerciseDB
 * @param limit - Number of exercises to fetch (default: 0 = all)
 * @param offset - Starting offset for pagination
 */
export async function fetchAllExercises(
  limit = 0,
  offset = 0
): Promise<ExerciseDBExercise[]> {
  const url = `${API_BASE_URL}/exercises?limit=${limit}&offset=${offset}`;
  
  console.log(`[exercisedb] Fetching exercises: limit=${limit}, offset=${offset}`);
  
  const response = await fetchWithRetry(url, {
    method: "GET",
    headers: getHeaders(),
  });
  
  const exercises = await response.json() as ExerciseDBExercise[];
  console.log(`[exercisedb] Fetched ${exercises.length} exercises`);
  
  return exercises;
}

/**
 * Fetch exercises in batches
 * @param batchSize - Number of exercises per batch (default: 500)
 * @param onBatch - Callback for each batch (for progress reporting)
 * @returns All exercises
 */
export async function fetchExercisesInBatches(
  batchSize = 500,
  onBatch?: (batch: ExerciseDBExercise[], batchIndex: number, total: number) => void
): Promise<ExerciseDBExercise[]> {
  const allExercises: ExerciseDBExercise[] = [];
  let offset = 0;
  let batchIndex = 0;
  let hasMore = true;
  
  console.log(`[exercisedb] Starting batch fetch with size ${batchSize}`);
  
  while (hasMore) {
    // Rate limiting delay between batches
    if (batchIndex > 0) {
      await sleep(RATE_LIMIT_DELAY_MS);
    }
    
    const batch = await fetchAllExercises(batchSize, offset);
    
    if (batch.length === 0) {
      hasMore = false;
    } else {
      allExercises.push(...batch);
      offset += batch.length;
      
      // Report progress
      if (onBatch) {
        onBatch(batch, batchIndex, allExercises.length);
      }
      
      console.log(`[exercisedb] Batch ${batchIndex + 1}: fetched ${batch.length}, total: ${allExercises.length}`);
      
      // If we got fewer than batchSize, we've reached the end
      if (batch.length < batchSize) {
        hasMore = false;
      }
      
      batchIndex++;
    }
  }
  
  console.log(`[exercisedb] Completed: ${allExercises.length} total exercises in ${batchIndex} batches`);
  return allExercises;
}

/**
 * Fetch a single exercise by ID
 */
export async function fetchExerciseById(id: string): Promise<ExerciseDBExercise> {
  const url = `${API_BASE_URL}/exercises/exercise/${id}`;
  
  const response = await fetchWithRetry(url, {
    method: "GET",
    headers: getHeaders(),
  });
  
  return await response.json() as ExerciseDBExercise;
}

/**
 * Fetch exercises by body part
 */
export async function fetchExercisesByBodyPart(
  bodyPart: string,
  limit = 0,
  offset = 0
): Promise<ExerciseDBExercise[]> {
  const url = `${API_BASE_URL}/exercises/bodyPart/${encodeURIComponent(bodyPart)}?limit=${limit}&offset=${offset}`;
  
  const response = await fetchWithRetry(url, {
    method: "GET",
    headers: getHeaders(),
  });
  
  return await response.json() as ExerciseDBExercise[];
}

/**
 * Fetch exercises by equipment type
 */
export async function fetchExercisesByEquipment(
  equipment: string,
  limit = 0,
  offset = 0
): Promise<ExerciseDBExercise[]> {
  const url = `${API_BASE_URL}/exercises/equipment/${encodeURIComponent(equipment)}?limit=${limit}&offset=${offset}`;
  
  const response = await fetchWithRetry(url, {
    method: "GET",
    headers: getHeaders(),
  });
  
  return await response.json() as ExerciseDBExercise[];
}

/**
 * Fetch exercises by target muscle
 */
export async function fetchExercisesByTarget(
  target: string,
  limit = 0,
  offset = 0
): Promise<ExerciseDBExercise[]> {
  const url = `${API_BASE_URL}/exercises/target/${encodeURIComponent(target)}?limit=${limit}&offset=${offset}`;
  
  const response = await fetchWithRetry(url, {
    method: "GET",
    headers: getHeaders(),
  });
  
  return await response.json() as ExerciseDBExercise[];
}

/**
 * Download a GIF from ExerciseDB
 * @returns Buffer containing the GIF data
 */
export async function downloadExerciseGif(gifUrl: string): Promise<Buffer> {
  console.log(`[exercisedb] Downloading GIF: ${gifUrl}`);
  
  const response = await fetchWithRetry(gifUrl, {
    method: "GET",
    // No auth headers needed for GIF URLs
  });
  
  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

/**
 * Check if ExerciseDB API is configured
 */
export function isExerciseDBConfigured(): boolean {
  return !!process.env.EXERCISEDB_API_KEY;
}

export default {
  fetchAllExercises,
  fetchExercisesInBatches,
  fetchExerciseById,
  fetchExercisesByBodyPart,
  fetchExercisesByEquipment,
  fetchExercisesByTarget,
  downloadExerciseGif,
  isExerciseDBConfigured,
};





