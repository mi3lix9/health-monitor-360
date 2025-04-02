
import * as tf from '@tensorflow/tfjs';
import { VitalSigns } from '../types';

// Simple model configuration
interface ModelConfig {
  inputSize: number;
  hiddenLayers: number[];
  outputSize: number;
}

// Initialize TensorFlow and create a model for infection detection
let model: tf.LayersModel | null = null;

// Dataset for training/inference (would ideally be much larger in a real app)
// Format: [temperature, heartRate, bloodOxygen, hydration, respiration, fatigue]
const normalVitalsData = [
  [37.0, 70, 98, 75, 16, 30],
  [36.8, 65, 97, 80, 15, 25],
  [37.2, 72, 96, 70, 17, 35],
  [36.5, 68, 99, 85, 14, 20],
  [37.1, 75, 97, 78, 16, 40]
];

const infectionVitalsData = [
  [38.5, 105, 93, 65, 20, 60],
  [39.0, 110, 92, 60, 22, 65],
  [38.7, 100, 91, 62, 21, 55],
  [38.2, 95, 93, 68, 19, 50],
  [39.2, 115, 90, 55, 23, 70]
];

// Initialize and train the model
export const initializeModel = async (): Promise<void> => {
  console.log('Initializing TensorFlow model for vital signs analysis...');
  
  if (model) {
    console.log('Model already initialized.');
    return;
  }

  try {
    // Check if a model is stored and load it
    const savedModel = await tf.loadLayersModel('indexeddb://vitals-detection-model');
    if (savedModel) {
      model = savedModel;
      console.log('Loaded existing model from storage');
      return;
    }
  } catch (e) {
    console.log('No saved model found, creating a new one...');
  }

  // Create a new model if none was loaded
  const config: ModelConfig = {
    inputSize: 6, // temperature, heartRate, bloodOxygen, hydration, respiration, fatigue
    hiddenLayers: [12, 8],
    outputSize: 1 // 0 = normal, 1 = infection
  };

  model = createModel(config);
  
  // Train the model with our sample data
  await trainModel();
  
  // Save the model for future use
  await model.save('indexeddb://vitals-detection-model');
  console.log('Model saved to IndexedDB');
};

// Create a neural network model
const createModel = (config: ModelConfig): tf.LayersModel => {
  const model = tf.sequential();
  
  // Input layer
  model.add(tf.layers.dense({
    units: config.hiddenLayers[0],
    activation: 'relu',
    inputShape: [config.inputSize]
  }));
  
  // Hidden layers
  for (let i = 1; i < config.hiddenLayers.length; i++) {
    model.add(tf.layers.dense({
      units: config.hiddenLayers[i],
      activation: 'relu'
    }));
  }
  
  // Output layer
  model.add(tf.layers.dense({
    units: config.outputSize,
    activation: 'sigmoid'
  }));
  
  model.compile({
    optimizer: 'adam',
    loss: 'binaryCrossentropy',
    metrics: ['accuracy']
  });
  
  return model;
};

// Train the model with sample data
const trainModel = async (): Promise<void> => {
  if (!model) return;
  
  // Prepare training data
  const trainingData = [...normalVitalsData, ...infectionVitalsData];
  const trainingLabels = [
    ...Array(normalVitalsData.length).fill(0),
    ...Array(infectionVitalsData.length).fill(1)
  ];
  
  const xs = tf.tensor2d(trainingData);
  const ys = tf.tensor2d(trainingLabels.map(l => [l]));
  
  // Train the model
  await model.fit(xs, ys, {
    epochs: 50,
    batchSize: 4,
    shuffle: true,
    callbacks: {
      onEpochEnd: (epoch, logs) => {
        console.log(`Epoch ${epoch}: loss = ${logs?.loss}, accuracy = ${logs?.acc}`);
      }
    }
  });
  
  // Clean up tensors
  xs.dispose();
  ys.dispose();
  
  console.log('Model training complete');
};

// Detect potential infections using the AI model
export const detectInfectionWithAI = async (vitals: VitalSigns): Promise<number> => {
  if (!model) {
    await initializeModel();
  }
  
  if (!model) {
    console.error('Failed to initialize the model');
    return 0;
  }
  
  // Normalize the input data
  const input = tf.tensor2d([
    [
      vitals.temperature,
      vitals.heartRate,
      vitals.bloodOxygen,
      vitals.hydration || 75,
      vitals.respiration || 16,
      vitals.fatigue || 30
    ]
  ]);
  
  // Run inference
  const prediction = model.predict(input) as tf.Tensor;
  const result = await prediction.data();
  
  // Clean up tensors
  input.dispose();
  prediction.dispose();
  
  return result[0]; // Probability of infection (0-1)
};

// Enhanced detection that combines rule-based and AI approaches
export const enhancedInfectionDetection = async (vitals: VitalSigns): Promise<{
  isInfection: boolean;
  confidence: number;
  method: 'rule-based' | 'ai' | 'combined';
}> => {
  // Get rule-based detection result
  const hasFever = vitals.temperature >= 38.0;
  const hasElevatedHeartRate = vitals.heartRate >= 100;
  const hasLowBloodOxygen = vitals.bloodOxygen < 94;
  
  let isRuleBasedInfection = false;
  
  if (vitals.temperature >= 39.0 && (hasElevatedHeartRate || hasLowBloodOxygen)) {
    isRuleBasedInfection = true;
  } else if (hasFever && hasElevatedHeartRate && hasLowBloodOxygen) {
    isRuleBasedInfection = true;
  } else if (hasFever && (hasElevatedHeartRate || hasLowBloodOxygen)) {
    isRuleBasedInfection = true;
  }
  
  // Get AI-based detection result
  const aiProbability = await detectInfectionWithAI(vitals);
  const isAiInfection = aiProbability >= 0.7; // 70% threshold
  
  // Combined approach
  let finalIsInfection: boolean;
  let confidence: number;
  let method: 'rule-based' | 'ai' | 'combined';
  
  if (isRuleBasedInfection && isAiInfection) {
    // Both approaches agree it's an infection
    finalIsInfection = true;
    confidence = Math.max(0.85, aiProbability);
    method = 'combined';
  } else if (isRuleBasedInfection) {
    // Only rule-based detected infection
    finalIsInfection = true;
    confidence = 0.6 + (aiProbability * 0.2); // Boost confidence if AI is somewhat close
    method = 'rule-based';
  } else if (isAiInfection && aiProbability > 0.85) {
    // AI is very confident but rules didn't trigger
    finalIsInfection = true;
    confidence = aiProbability;
    method = 'ai';
  } else {
    // Neither approach detected infection with high confidence
    finalIsInfection = false;
    confidence = aiProbability < 0.3 ? 0.9 : 0.7;
    method = aiProbability < 0.3 ? 'combined' : 'ai';
  }
  
  return {
    isInfection: finalIsInfection,
    confidence,
    method
  };
};

