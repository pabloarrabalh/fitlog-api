require('dotenv').config();

const mongoose = require('mongoose');
const connectDB = require('../src/config/database');
const Exercise = require('../src/models/Exercise');

const exercises = [
	{
		name: 'Press banca plano',
		description: 'Press básico con barra para el desarrollo global del pectoral.',
		primaryMuscles: ['chest'],
		secondaryMuscles: ['triceps', 'front delts'],
		equipment: 'barbell',
		movementPattern: 'push',
		difficulty: 'moderate'
	},
	{
		name: 'Press banca inclinado',
		description: 'Variante inclinada para enfatizar la porción superior del pecho.',
		primaryMuscles: ['upper chest'],
		secondaryMuscles: ['triceps', 'front delts'],
		equipment: 'barbell',
		movementPattern: 'push',
		difficulty: 'moderate'
	},
	{
		name: 'Press con mancuernas',
		description: 'Press horizontal con mancuernas para mayor recorrido y estabilidad.',
		primaryMuscles: ['chest'],
		secondaryMuscles: ['triceps', 'front delts'],
		equipment: 'dumbbell',
		movementPattern: 'push',
		difficulty: 'moderate'
	},
	{
		name: 'Aperturas con mancuernas',
		description: 'Movimiento de aislamiento para abrir el pecho y trabajar la aducción horizontal.',
		primaryMuscles: ['chest'],
		secondaryMuscles: [],
		equipment: 'dumbbell',
		movementPattern: 'push',
		difficulty: 'easy'
	},
	{
		name: 'Cruces en polea',
		description: 'Aperturas en polea para tensión continua en el pectoral.',
		primaryMuscles: ['chest'],
		secondaryMuscles: [],
		equipment: 'cable',
		movementPattern: 'push',
		difficulty: 'easy'
	},
	{
		name: 'Dominadas',
		description: 'Ejercicio compuesto de tracción vertical con peso corporal.',
		primaryMuscles: ['lats', 'upper back'],
		secondaryMuscles: ['biceps', 'forearms'],
		equipment: 'bodyweight',
		movementPattern: 'pull',
		difficulty: 'hard'
	},
	{
		name: 'Jalón al pecho',
		description: 'Tracción vertical en polea para trabajar dorsales y espalda alta.',
		primaryMuscles: ['lats'],
		secondaryMuscles: ['biceps', 'rear delts'],
		equipment: 'machine',
		movementPattern: 'pull',
		difficulty: 'moderate'
	},
	{
		name: 'Remo con barra',
		description: 'Remo libre para el desarrollo de la espalda media y dorsal.',
		primaryMuscles: ['upper back', 'lats'],
		secondaryMuscles: ['biceps', 'rear delts', 'erectors'],
		equipment: 'barbell',
		movementPattern: 'pull',
		difficulty: 'hard'
	},
	{
		name: 'Remo con mancuerna',
		description: 'Remo unilateral para mejorar simetría y control escapular.',
		primaryMuscles: ['lats', 'upper back'],
		secondaryMuscles: ['biceps', 'rear delts'],
		equipment: 'dumbbell',
		movementPattern: 'pull',
		difficulty: 'moderate'
	},
	{
		name: 'Peso muerto',
		description: 'Ejercicio global de bisagra de cadera con alta demanda de fuerza.',
		primaryMuscles: ['glutes', 'hamstrings', 'lower back'],
		secondaryMuscles: ['upper back', 'forearms'],
		equipment: 'barbell',
		movementPattern: 'hinge',
		difficulty: 'hard'
	},
	{
		name: 'Sentadilla',
		description: 'Movimiento base para el desarrollo de fuerza y masa en tren inferior.',
		primaryMuscles: ['quads', 'glutes'],
		secondaryMuscles: ['hamstrings', 'core', 'lower back'],
		equipment: 'barbell',
		movementPattern: 'squat',
		difficulty: 'hard'
	},
	{
		name: 'Prensa de piernas',
		description: 'Ejercicio guiado para cargar volumen sobre cuádriceps y glúteos.',
		primaryMuscles: ['quads', 'glutes'],
		secondaryMuscles: ['hamstrings'],
		equipment: 'machine',
		movementPattern: 'squat',
		difficulty: 'moderate'
	},
	{
		name: 'Zancadas',
		description: 'Trabajo unilateral para piernas y estabilidad de cadera.',
		primaryMuscles: ['quads', 'glutes'],
		secondaryMuscles: ['hamstrings', 'core'],
		equipment: 'bodyweight',
		movementPattern: 'squat',
		difficulty: 'moderate'
	},
	{
		name: 'Extensión de cuádriceps',
		description: 'Aislamiento de cuádriceps en máquina.',
		primaryMuscles: ['quads'],
		secondaryMuscles: [],
		equipment: 'machine',
		movementPattern: 'squat',
		difficulty: 'easy'
	},
	{
		name: 'Curl femoral',
		description: 'Aislamiento de isquiotibiales en máquina.',
		primaryMuscles: ['hamstrings'],
		secondaryMuscles: [],
		equipment: 'machine',
		movementPattern: 'hinge',
		difficulty: 'easy'
	},
	{
		name: 'Hip thrust',
		description: 'Ejercicio prioritario para glúteos con alta activación de cadera.',
		primaryMuscles: ['glutes'],
		secondaryMuscles: ['hamstrings', 'core'],
		equipment: 'barbell',
		movementPattern: 'hinge',
		difficulty: 'moderate'
	},
	{
		name: 'Elevación de gemelos',
		description: 'Trabajo específico de pantorrilla para gemelos y sóleo.',
		primaryMuscles: ['calves'],
		secondaryMuscles: [],
		equipment: 'machine',
		movementPattern: 'carry',
		difficulty: 'easy'
	},
	{
		name: 'Press militar',
		description: 'Empuje vertical para hombro y tríceps.',
		primaryMuscles: ['shoulders'],
		secondaryMuscles: ['triceps', 'upper chest'],
		equipment: 'barbell',
		movementPattern: 'push',
		difficulty: 'hard'
	},
	{
		name: 'Elevaciones laterales',
		description: 'Aislamiento del deltoide medio.',
		primaryMuscles: ['side delts'],
		secondaryMuscles: [],
		equipment: 'dumbbell',
		movementPattern: 'push',
		difficulty: 'easy'
	},
	{
		name: 'Elevaciones frontales',
		description: 'Aislamiento del deltoide anterior.',
		primaryMuscles: ['front delts'],
		secondaryMuscles: [],
		equipment: 'dumbbell',
		movementPattern: 'push',
		difficulty: 'easy'
	},
	{
		name: 'Pájaros (deltoide posterior)',
		description: 'Ejercicio de aislamiento para el deltoide posterior.',
		primaryMuscles: ['rear delts'],
		secondaryMuscles: ['upper back'],
		equipment: 'dumbbell',
		movementPattern: 'pull',
		difficulty: 'easy'
	},
	{
		name: 'Curl de bíceps con barra',
		description: 'Curl básico para bíceps con barra recta o EZ.',
		primaryMuscles: ['biceps'],
		secondaryMuscles: ['forearms'],
		equipment: 'barbell',
		movementPattern: 'pull',
		difficulty: 'easy'
	},
	{
		name: 'Curl martillo',
		description: 'Curl neutro para bíceps y braquiorradial.',
		primaryMuscles: ['biceps', 'forearms'],
		secondaryMuscles: [],
		equipment: 'dumbbell',
		movementPattern: 'pull',
		difficulty: 'easy'
	},
	{
		name: 'Curl concentrado',
		description: 'Curl de aislamiento para maximizar la contracción del bíceps.',
		primaryMuscles: ['biceps'],
		secondaryMuscles: [],
		equipment: 'dumbbell',
		movementPattern: 'pull',
		difficulty: 'easy'
	},
	{
		name: 'Fondos de tríceps',
		description: 'Movimiento compuesto para tríceps con peso corporal.',
		primaryMuscles: ['triceps'],
		secondaryMuscles: ['chest', 'shoulders'],
		equipment: 'bodyweight',
		movementPattern: 'push',
		difficulty: 'moderate'
	},
	{
		name: 'Extensión de tríceps en polea',
		description: 'Aislamiento de tríceps en cable con tensión constante.',
		primaryMuscles: ['triceps'],
		secondaryMuscles: [],
		equipment: 'cable',
		movementPattern: 'push',
		difficulty: 'easy'
	},
	{
		name: 'Press francés',
		description: 'Extensión de tríceps por encima de la cabeza o tumbado.',
		primaryMuscles: ['triceps'],
		secondaryMuscles: ['shoulders'],
		equipment: 'barbell',
		movementPattern: 'push',
		difficulty: 'moderate'
	},
	{
		name: 'Crunch abdominal',
		description: 'Flexión de tronco para trabajar la pared abdominal.',
		primaryMuscles: ['abs'],
		secondaryMuscles: [],
		equipment: 'bodyweight',
		movementPattern: 'core',
		difficulty: 'easy'
	},
	{
		name: 'Crunch en máquina',
		description: 'Crunch guiado para aumentar la carga sobre el abdomen.',
		primaryMuscles: ['abs'],
		secondaryMuscles: [],
		equipment: 'machine',
		movementPattern: 'core',
		difficulty: 'easy'
	},
	{
		name: 'Elevaciones de piernas',
		description: 'Trabajo de core con énfasis en la parte inferior del abdomen.',
		primaryMuscles: ['abs', 'hip flexors'],
		secondaryMuscles: [],
		equipment: 'bodyweight',
		movementPattern: 'core',
		difficulty: 'moderate'
	},
	{
		name: 'Elevaciones de piernas colgado',
		description: 'Variante avanzada de elevación de piernas con gran demanda de core.',
		primaryMuscles: ['abs', 'hip flexors'],
		secondaryMuscles: ['forearms'],
		equipment: 'bodyweight',
		movementPattern: 'core',
		difficulty: 'hard'
	},
	{
		name: 'Plancha',
		description: 'Ejercicio isométrico para estabilidad y resistencia del core.',
		primaryMuscles: ['core'],
		secondaryMuscles: ['shoulders', 'glutes'],
		equipment: 'bodyweight',
		movementPattern: 'core',
		difficulty: 'easy'
	},
	{
		name: 'Plancha lateral',
		description: 'Variación lateral de plancha para oblicuos y estabilidad.',
		primaryMuscles: ['obliques', 'core'],
		secondaryMuscles: ['shoulders'],
		equipment: 'bodyweight',
		movementPattern: 'core',
		difficulty: 'moderate'
	},
	{
		name: 'Russian twists',
		description: 'Rotación de tronco para oblicuos y control del core.',
		primaryMuscles: ['obliques'],
		secondaryMuscles: ['core', 'hip flexors'],
		equipment: 'bodyweight',
		movementPattern: 'core',
		difficulty: 'moderate'
	},
	{
		name: 'Mountain climbers',
		description: 'Movimiento dinámico de core con componente cardiovascular.',
		primaryMuscles: ['core'],
		secondaryMuscles: ['shoulders', 'hip flexors'],
		equipment: 'bodyweight',
		movementPattern: 'core',
		difficulty: 'moderate'
	}
];


async function seedExercises(options = {}) {
	const shouldCloseConnection = options.closeConnection === true;

	if (mongoose.connection.readyState === 0) {
		await connectDB();
	}

	const operations = exercises.map((exercise) => ({
		updateOne: {
			filter: { name: exercise.name },
			update: {
				$set: {
					...exercise,
					visibility: 'public',
					approvalStatus: 'approved',
					reviewedBy: null,
					reviewedAt: null,
					createdBy: null
				}
			},
			upsert: true
		}
	}));

	const result = await Exercise.bulkWrite(operations);

	console.log(`Seed completado. Insertados o actualizados: ${result.upsertedCount + result.modifiedCount}`);

	if (shouldCloseConnection) {
		await mongoose.connection.close();
	}
}

if (require.main === module) {
	seedExercises({ closeConnection: true }).catch(async (error) => {
		console.error('Error al ejecutar el seeder:', error);
		await mongoose.connection.close();
		process.exit(1);
	});
}

module.exports = seedExercises;
