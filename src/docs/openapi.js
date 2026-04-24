const userSchema = {
  type: 'object',
  properties: {
    id: { type: 'string', example: '66f0c0f0c0f0c0f0c0f0c0f0' },
    username: { type: 'string', example: 'pablofit' },
    firstName: { type: 'string', example: 'Pablo' },
    lastName: { type: 'string', example: 'García' },
    email: { type: 'string', example: 'pablo@example.com' },
    profileCompleted: { type: 'boolean', example: true },
    role: { type: 'string', enum: ['user', 'admin'], example: 'user' },
    experience: { type: 'string', enum: ['beginner', 'intermediate', 'advanced'], example: 'intermediate' },
    objective: { type: 'string', enum: ['strength', 'hypertrophy', 'endurance', 'recomposition'], example: 'hypertrophy' },
    bodyWeightKg: { type: 'number', nullable: true, example: 78.5 }
  }
};

const exerciseSchema = {
  type: 'object',
  properties: {
    _id: { type: 'string', example: '66f0c0f0c0f0c0f0c0f0c0f1' },
    name: { type: 'string', example: 'Barbell Bench Press' },
    description: { type: 'string', example: 'Compound pushing movement' },
    primaryMuscles: { type: 'array', items: { type: 'string' }, example: ['chest', 'triceps'] },
    secondaryMuscles: { type: 'array', items: { type: 'string' }, example: ['front delts'] },
    equipment: { type: 'string', enum: ['barbell', 'dumbbell', 'machine', 'cable', 'bodyweight', 'kettlebell', 'other'], example: 'barbell' },
    movementPattern: { type: 'string', enum: ['push', 'pull', 'squat', 'hinge', 'carry', 'core', 'other'], example: 'push' },
    difficulty: { type: 'string', enum: ['easy', 'moderate', 'hard'], example: 'moderate' },
    visibility: { type: 'string', enum: ['public', 'private'], example: 'public' },
    approvalStatus: { type: 'string', enum: ['pending', 'approved', 'rejected'], example: 'approved' },
    reviewedBy: { type: 'string', nullable: true, example: '66f0c0f0c0f0c0f0c0f0c0f2' },
    reviewedAt: { type: 'string', nullable: true, format: 'date-time' },
    substitutes: { type: 'array', items: { type: 'string' } },
    createdBy: { type: 'string', nullable: true, example: '66f0c0f0c0f0c0f0c0f0c0f3' },
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' }
  }
};

const routineExerciseSchema = {
  type: 'object',
  properties: {
    _id: { type: 'string' },
    exercise: { anyOf: [{ type: 'string' }, { $ref: '#/components/schemas/Exercise' }] },
    order: { type: 'integer', example: 1 },
    targetSets: { type: 'integer', example: 4 },
    targetRepsMin: { type: 'integer', example: 6 },
    targetRepsMax: { type: 'integer', example: 8 },
    targetWeightKg: { type: 'number', example: 80 },
    restSeconds: { type: 'number', example: 120 },
    notes: { type: 'string', example: 'Leave 1-2 reps in reserve' }
  }
};

const routineSchema = {
  type: 'object',
  properties: {
    _id: { type: 'string' },
    user: { type: 'string' },
    name: { type: 'string', example: 'Upper body A' },
    objective: { type: 'string', enum: ['strength', 'hypertrophy', 'endurance', 'recomposition'], example: 'hypertrophy' },
    description: { type: 'string', example: 'Push/pull split for upper body' },
    exercises: { type: 'array', items: { $ref: '#/components/schemas/RoutineExercise' } },
    isArchived: { type: 'boolean', example: false },
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' }
  }
};

const performedSetSchema = {
  type: 'object',
  properties: {
    _id: { type: 'string' },
    setNumber: { type: 'integer', example: 1 },
    reps: { type: 'integer', example: 8 },
    weightKg: { type: 'number', example: 80 },
    restSeconds: { type: 'integer', example: 120 },
    rpe: { type: 'number', nullable: true, example: 8 },
    completed: { type: 'boolean', example: true }
  }
};

const sessionEntrySchema = {
  type: 'object',
  properties: {
    _id: { type: 'string' },
    exercise: { anyOf: [{ type: 'string' }, { $ref: '#/components/schemas/Exercise' }] },
    order: { type: 'integer', example: 1 },
    plannedSets: { type: 'integer', example: 4 },
    plannedRepsMin: { type: 'integer', example: 6 },
    plannedRepsMax: { type: 'integer', example: 8 },
    plannedWeightKg: { type: 'number', example: 80 },
    restSeconds: { type: 'integer', example: 120 },
    notes: { type: 'string', example: 'Progressive overload focus' },
    previousPerformance: {
      type: 'object',
      properties: {
        date: { type: 'string', nullable: true, format: 'date-time' },
        sets: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              setNumber: { type: 'integer' },
              reps: { type: 'integer' },
              weightKg: { type: 'number' }
            }
          }
        }
      }
    },
    performedSets: { type: 'array', items: { $ref: '#/components/schemas/PerformedSet' } }
  }
};

const sessionSchema = {
  type: 'object',
  properties: {
    _id: { type: 'string' },
    user: { type: 'string' },
    routine: { anyOf: [{ type: 'string' }, { $ref: '#/components/schemas/Routine' }, { type: 'null' }] },
    objective: { type: 'string', enum: ['strength', 'hypertrophy', 'endurance', 'recomposition'], example: 'hypertrophy' },
    status: { type: 'string', enum: ['in_progress', 'completed'], example: 'in_progress' },
    startedAt: { type: 'string', format: 'date-time' },
    completedAt: { type: 'string', nullable: true, format: 'date-time' },
    notes: { type: 'string', example: 'Felt strong today' },
    entries: { type: 'array', items: { $ref: '#/components/schemas/SessionEntry' } },
    totalVolumeKg: { type: 'number', example: 8740 },
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' }
  }
};

const responseWrapper = {
  type: 'object',
  properties: {
    success: { type: 'boolean', example: true },
    data: {}
  }
};

const apiSpec = {
  openapi: '3.0.3',
  info: {
    title: 'Fitlog API',
    version: '1.0.0',
    description: 'Documentación interactiva de la API de Fitlog para autenticación, usuarios, ejercicios, rutinas, sesiones y social.'
  },
  servers: [
    { url: '/api', description: 'API base path' }
  ],
  tags: [
    { name: 'Health' },
    { name: 'Auth' },
    { name: 'Users' },
    { name: 'Exercises' },
    { name: 'Routines' },
    { name: 'Sessions' },
    { name: 'Social' }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    },
    schemas: {
      ApiResponse: responseWrapper,
      ErrorResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          message: { type: 'string', example: 'Validation error' },
          errors: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                path: { type: 'string', example: 'email' },
                message: { type: 'string', example: 'Invalid email address' }
              }
            }
          }
        }
      },
      AuthRegisterRequest: {
        type: 'object',
        required: ['firstName', 'lastName', 'username', 'email', 'password'],
        properties: {
          firstName: { type: 'string', example: 'Pablo' },
          lastName: { type: 'string', example: 'García' },
          username: { type: 'string', example: 'pablofit' },
          email: { type: 'string', example: 'pablo@example.com' },
          password: { type: 'string', example: 'secret123' },
          experience: { type: 'string', enum: ['beginner', 'intermediate', 'advanced'] },
          objective: { type: 'string', enum: ['strength', 'hypertrophy', 'endurance', 'recomposition'] },
          bodyWeightKg: { type: 'number', nullable: true, example: 78.5 }
        }
      },
      AuthLoginRequest: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', example: 'pablo@example.com' },
          password: { type: 'string', example: 'secret123' }
        }
      },
      UpdateMeRequest: {
        type: 'object',
        properties: {
          firstName: { type: 'string', example: 'Pablo' },
          lastName: { type: 'string', example: 'García' },
          experience: { type: 'string', enum: ['beginner', 'intermediate', 'advanced'] },
          objective: { type: 'string', enum: ['strength', 'hypertrophy', 'endurance', 'recomposition'] },
          bodyWeightKg: { type: 'number', nullable: true, example: 80 },
          password: { type: 'string', example: 'newsecret123' }
        }
      },
      ExerciseQuery: {
        type: 'object',
        properties: {
          q: { type: 'string', example: 'bench' },
          muscle: { type: 'string', example: 'chest' },
          equipment: { type: 'string', enum: ['barbell', 'dumbbell', 'machine', 'cable', 'bodyweight', 'kettlebell', 'other'] },
          limit: { type: 'integer', example: 25 },
          page: { type: 'integer', example: 1 }
        }
      },
      ExerciseRequest: {
        type: 'object',
        required: ['name', 'primaryMuscles'],
        properties: {
          name: { type: 'string', example: 'Barbell Bench Press' },
          description: { type: 'string', example: 'Compound pushing movement' },
          primaryMuscles: { type: 'array', items: { type: 'string' }, example: ['chest', 'triceps'] },
          secondaryMuscles: { type: 'array', items: { type: 'string' }, example: ['front delts'] },
          equipment: { type: 'string', enum: ['barbell', 'dumbbell', 'machine', 'cable', 'bodyweight', 'kettlebell', 'other'] },
          movementPattern: { type: 'string', enum: ['push', 'pull', 'squat', 'hinge', 'carry', 'core', 'other'] },
          difficulty: { type: 'string', enum: ['easy', 'moderate', 'hard'] },
          visibility: { type: 'string', enum: ['public', 'private'] },
          substitutes: { type: 'array', items: { type: 'string' } }
        }
      },
      RoutineExerciseRequest: {
        type: 'object',
        required: ['exercise', 'order', 'targetSets', 'targetRepsMin', 'targetRepsMax'],
        properties: {
          exercise: { type: 'string', example: '66f0c0f0c0f0c0f0c0f0c0f1' },
          order: { type: 'integer', example: 1 },
          targetSets: { type: 'integer', example: 4 },
          targetRepsMin: { type: 'integer', example: 6 },
          targetRepsMax: { type: 'integer', example: 8 },
          targetWeightKg: { type: 'number', example: 80 },
          restSeconds: { type: 'integer', example: 120 },
          notes: { type: 'string', example: 'Main lift' }
        }
      },
      RoutineRequest: {
        type: 'object',
        required: ['name'],
        properties: {
          name: { type: 'string', example: 'Upper body A' },
          objective: { type: 'string', enum: ['strength', 'hypertrophy', 'endurance', 'recomposition'] },
          description: { type: 'string', example: 'Upper body split' },
          exercises: { type: 'array', items: { $ref: '#/components/schemas/RoutineExerciseRequest' } }
        }
      },
      AdHocExerciseRequest: {
        type: 'object',
        required: ['exercise', 'order', 'plannedSets', 'plannedRepsMin', 'plannedRepsMax'],
        properties: {
          exercise: { type: 'string', example: '66f0c0f0c0f0c0f0c0f0c0f1' },
          order: { type: 'integer', example: 1 },
          plannedSets: { type: 'integer', example: 4 },
          plannedRepsMin: { type: 'integer', example: 6 },
          plannedRepsMax: { type: 'integer', example: 8 },
          plannedWeightKg: { type: 'number', example: 80 },
          restSeconds: { type: 'integer', example: 120 },
          notes: { type: 'string', example: 'Optional extra set' }
        }
      },
      StartSessionRequest: {
        type: 'object',
        properties: {
          routineId: { type: 'string', example: '66f0c0f0c0f0c0f0c0f0c0f4' },
          objective: { type: 'string', enum: ['strength', 'hypertrophy', 'endurance', 'recomposition'] },
          notes: { type: 'string', example: 'Feeling good today' },
          exercises: { type: 'array', items: { $ref: '#/components/schemas/AdHocExerciseRequest' } }
        }
      },
      AddSetRequest: {
        type: 'object',
        required: ['setNumber', 'reps', 'weightKg'],
        properties: {
          setNumber: { type: 'integer', example: 1 },
          reps: { type: 'integer', example: 8 },
          weightKg: { type: 'number', example: 80 },
          restSeconds: { type: 'integer', example: 120 },
          rpe: { type: 'number', example: 8 },
          completed: { type: 'boolean', example: true }
        }
      },
      CompleteSessionRequest: {
        type: 'object',
        properties: {
          notes: { type: 'string', example: 'Great session' }
        }
      },
      FriendActionResponse: {
        type: 'object',
        properties: {
          friendId: { type: 'string', example: '66f0c0f0c0f0c0f0c0f0c0f9' }
        }
      },
      DeleteResponse: {
        type: 'object',
        properties: {
          deleted: { type: 'boolean', example: true },
          exerciseId: { type: 'string', example: '66f0c0f0c0f0c0f0c0f0c0f1' }
        }
      },
      User: userSchema,
      Exercise: exerciseSchema,
      RoutineExercise: routineExerciseSchema,
      Routine: routineSchema,
      PerformedSet: performedSetSchema,
      SessionEntry: sessionEntrySchema,
      Session: sessionSchema
    }
  },
  paths: {
    '/health': {
      get: {
        tags: ['Health'],
        summary: 'Health check',
        responses: {
          200: {
            description: 'API is healthy',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    message: { type: 'string' },
                    timestamp: { type: 'string', format: 'date-time' }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/auth/register': {
      post: {
        tags: ['Auth'],
        summary: 'Register a new user',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/AuthRegisterRequest' }
            }
          }
        },
        responses: {
          201: {
            description: 'User created',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: {
                      type: 'object',
                      properties: {
                        token: { type: 'string' },
                        user: { $ref: '#/components/schemas/User' }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Login with email or username',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/AuthLoginRequest' }
            }
          }
        },
        responses: {
          200: {
            description: 'Authenticated',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: {
                      type: 'object',
                      properties: {
                        token: { type: 'string' },
                        user: { $ref: '#/components/schemas/User' }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/auth/me': {
      get: {
        tags: ['Auth'],
        summary: 'Get current authenticated user',
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Current user',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: { $ref: '#/components/schemas/User' }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/users/me': {
      get: {
        tags: ['Users'],
        summary: 'Get my profile',
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'My profile',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: { $ref: '#/components/schemas/User' }
                  }
                }
              }
            }
          }
        }
      },
      patch: {
        tags: ['Users'],
        summary: 'Update my profile',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/UpdateMeRequest' } }
          }
        },
        responses: {
          200: {
            description: 'Profile updated',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: { $ref: '#/components/schemas/User' }
                  }
                }
              }
            }
          }
        }
      },
      delete: {
        tags: ['Users'],
        summary: 'Delete my account',
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Account deleted',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: { $ref: '#/components/schemas/User' }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/users': {
      get: {
        tags: ['Users'],
        summary: 'List all users',
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Users list',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: { type: 'array', items: { $ref: '#/components/schemas/User' } }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/users/{userId}': {
      get: {
        tags: ['Users'],
        summary: 'Get a user by ID',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'userId',
            in: 'path',
            required: true,
            schema: { type: 'string' }
          }
        ],
        responses: {
          200: {
            description: 'User profile',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: { $ref: '#/components/schemas/User' }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/exercises': {
      get: {
        tags: ['Exercises'],
        summary: 'List exercises',
        parameters: [
          { name: 'q', in: 'query', schema: { type: 'string' } },
          { name: 'muscle', in: 'query', schema: { type: 'string' } },
          { name: 'equipment', in: 'query', schema: { type: 'string' } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 25 } },
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } }
        ],
        responses: {
          200: {
            description: 'Exercises list',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: { type: 'array', items: { $ref: '#/components/schemas/Exercise' } }
                  }
                }
              }
            }
          }
        }
      },
      post: {
        tags: ['Exercises'],
        summary: 'Create an exercise',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/ExerciseRequest' } }
          }
        },
        responses: {
          201: {
            description: 'Exercise created',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: { $ref: '#/components/schemas/Exercise' }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/exercises/mine': {
      get: {
        tags: ['Exercises'],
        summary: 'List my exercises',
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'My exercises',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: { type: 'array', items: { $ref: '#/components/schemas/Exercise' } }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/exercises/pending': {
      get: {
        tags: ['Exercises'],
        summary: 'List pending exercises',
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Pending exercises',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: { type: 'array', items: { $ref: '#/components/schemas/Exercise' } }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/exercises/{exerciseId}': {
      get: {
        tags: ['Exercises'],
        summary: 'Get exercise by ID',
        parameters: [
          { name: 'exerciseId', in: 'path', required: true, schema: { type: 'string' } }
        ],
        responses: {
          200: {
            description: 'Exercise details',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: { $ref: '#/components/schemas/Exercise' }
                  }
                }
              }
            }
          }
        }
      },
      patch: {
        tags: ['Exercises'],
        summary: 'Update an exercise',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'exerciseId', in: 'path', required: true, schema: { type: 'string' } }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/ExerciseRequest' } }
          }
        },
        responses: {
          200: {
            description: 'Exercise updated',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: { $ref: '#/components/schemas/Exercise' }
                  }
                }
              }
            }
          }
        }
      },
      delete: {
        tags: ['Exercises'],
        summary: 'Delete an exercise',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'exerciseId', in: 'path', required: true, schema: { type: 'string' } }
        ],
        responses: {
          200: {
            description: 'Exercise deleted',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: { $ref: '#/components/schemas/Exercise' }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/exercises/{exerciseId}/approve': {
      patch: {
        tags: ['Exercises'],
        summary: 'Approve an exercise',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'exerciseId', in: 'path', required: true, schema: { type: 'string' } }
        ],
        responses: {
          200: {
            description: 'Exercise approved',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: { $ref: '#/components/schemas/Exercise' }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/exercises/{exerciseId}/reject': {
      patch: {
        tags: ['Exercises'],
        summary: 'Reject an exercise and delete it',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'exerciseId', in: 'path', required: true, schema: { type: 'string' } }
        ],
        responses: {
          200: {
            description: 'Exercise rejected',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: { $ref: '#/components/schemas/DeleteResponse' }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/routines': {
      get: {
        tags: ['Routines'],
        summary: 'List my routines',
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Routine list',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: { type: 'array', items: { $ref: '#/components/schemas/Routine' } }
                  }
                }
              }
            }
          }
        }
      },
      post: {
        tags: ['Routines'],
        summary: 'Create a routine',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/RoutineRequest' } }
          }
        },
        responses: {
          201: {
            description: 'Routine created',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: { $ref: '#/components/schemas/Routine' }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/routines/{routineId}': {
      get: {
        tags: ['Routines'],
        summary: 'Get routine by ID',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'routineId', in: 'path', required: true, schema: { type: 'string' } }
        ],
        responses: {
          200: {
            description: 'Routine details',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: { $ref: '#/components/schemas/Routine' }
                  }
                }
              }
            }
          }
        }
      },
      patch: {
        tags: ['Routines'],
        summary: 'Update routine',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'routineId', in: 'path', required: true, schema: { type: 'string' } }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/RoutineRequest' } }
          }
        },
        responses: {
          200: {
            description: 'Routine updated',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: { $ref: '#/components/schemas/Routine' }
                  }
                }
              }
            }
          }
        }
      },
      delete: {
        tags: ['Routines'],
        summary: 'Delete routine',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'routineId', in: 'path', required: true, schema: { type: 'string' } }
        ],
        responses: {
          200: {
            description: 'Routine deleted',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: { $ref: '#/components/schemas/Routine' }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/sessions': {
      get: {
        tags: ['Sessions'],
        summary: 'List my sessions',
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Sessions list',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: { type: 'array', items: { $ref: '#/components/schemas/Session' } }
                  }
                }
              }
            }
          }
        }
      },
      post: {
        tags: ['Sessions'],
        summary: 'Start a session',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/StartSessionRequest' } }
          }
        },
        responses: {
          201: {
            description: 'Session created',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: { $ref: '#/components/schemas/Session' }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/sessions/{sessionId}': {
      get: {
        tags: ['Sessions'],
        summary: 'Get session by ID',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'sessionId', in: 'path', required: true, schema: { type: 'string' } }
        ],
        responses: {
          200: {
            description: 'Session details',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: { $ref: '#/components/schemas/Session' }
                  }
                }
              }
            }
          }
        }
      },
      patch: {
        tags: ['Sessions'],
        summary: 'Update session',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'sessionId', in: 'path', required: true, schema: { type: 'string' } }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': { schema: { type: 'object', additionalProperties: true } }
          }
        },
        responses: {
          200: {
            description: 'Session updated',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: { $ref: '#/components/schemas/Session' }
                  }
                }
              }
            }
          }
        }
      },
      delete: {
        tags: ['Sessions'],
        summary: 'Delete session',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'sessionId', in: 'path', required: true, schema: { type: 'string' } }
        ],
        responses: {
          200: {
            description: 'Session deleted',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: { $ref: '#/components/schemas/Session' }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/sessions/{sessionId}/entries/{entryId}/sets': {
      post: {
        tags: ['Sessions'],
        summary: 'Add performed set to session entry',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'sessionId', in: 'path', required: true, schema: { type: 'string' } },
          { name: 'entryId', in: 'path', required: true, schema: { type: 'string' } }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/AddSetRequest' } }
          }
        },
        responses: {
          200: {
            description: 'Set added',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: { $ref: '#/components/schemas/Session' }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/sessions/{sessionId}/complete': {
      post: {
        tags: ['Sessions'],
        summary: 'Complete a session',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'sessionId', in: 'path', required: true, schema: { type: 'string' } }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/CompleteSessionRequest' } }
          }
        },
        responses: {
          200: {
            description: 'Session completed',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: { $ref: '#/components/schemas/Session' }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/social/friends': {
      get: {
        tags: ['Social'],
        summary: 'List friends',
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Friends list',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: { type: 'array', items: { $ref: '#/components/schemas/User' } }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/social/friends/{friendId}': {
      post: {
        tags: ['Social'],
        summary: 'Add friend',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'friendId', in: 'path', required: true, schema: { type: 'string' } }
        ],
        responses: {
          200: {
            description: 'Friend added',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: { $ref: '#/components/schemas/FriendActionResponse' }
                  }
                }
              }
            }
          }
        }
      },
      delete: {
        tags: ['Social'],
        summary: 'Remove friend',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'friendId', in: 'path', required: true, schema: { type: 'string' } }
        ],
        responses: {
          200: {
            description: 'Friend removed',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: { $ref: '#/components/schemas/FriendActionResponse' }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/social/friends/{friendId}/workouts': {
      get: {
        tags: ['Social'],
        summary: 'List completed workouts from a friend',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'friendId', in: 'path', required: true, schema: { type: 'string' } }
        ],
        responses: {
          200: {
            description: 'Friend workouts',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: { type: 'array', items: { $ref: '#/components/schemas/Session' } }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
};

module.exports = apiSpec;