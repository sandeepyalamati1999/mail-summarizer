/**
 * @swagger
 * components:
 *   schemas:
 *     usersCreateResponse:
 *       type: object
 *       example:
 *         respCode: 204
 *         respMessage: Users created sucessfully  
 *         usersId: 65cf00cf79006139a66bfd62
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     usersUpdateResponse:
 *       type: object
 *       example:
 *         respCode: 205
 *         respMessage: Users updated sucessfully  
 *         usersId: 65cf00cf79006139a66bfd62
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     usersDeleteResponse:
 *       type: object
 *       example:
 *         respCode: 206
 *         respMessage: Users deleted sucessfully  
 *         usersId: 65cf00cf79006139a66bfd62
 */

/**
 * @swagger
 * components:
 *      schemas:
 *          MultideleteInput:
 *              type: object
 *              required:
 *                  - selectedIds
 *              properties:
 *                  selectedIds:
 *                       type: array
 *                       description: ArrayofStrings
 *              example:
 *                    selectedIds: ArrayOfStrings
 *              
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     tags:
 *        - Users
 *     summary: Get all users from MongoDB
 *     description: Retrieve all orders records from MongoDB.
 *     responses:
 *       200:
 *         description: Successful response
 */

/**
 * @swagger
 * /api/users/{usersId}:
 *   get:
 *     tags:
 *        - Users
 *     summary: Get a specific users by ID
 *     description: Retrieve a specific order record from MongoDB by its ID.
 *     parameters:
 *       - name: usersId
 *         in: path
 *         required: true
 *         type: string
 *         description: ID of the users to retrieve
 *     responses:
 *       200:
 *         description: Successful response
 */

/**
 * @swagger
 * /api/users:
 *   post:
 *     tags:
 *       - Users
 *     summary: Create a new users
 *     description: Create a new users record in MongoDB.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#components/schemas/usersInputSchema'
 *     responses:
 *       204:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#components/schemas/usersCreateResponse'
 */

/**
 * @swagger
 * /api/users/{usersId}:
 *   put:
 *     tags:
 *         - Users
 *     summary: Update a specific users by ID
 *     description: Update a specific users record in MongoDB by its ID.
 *     parameters:
 *       - name: usersId
 *         in: path
 *         required: true
 *         type: string
 *         description: ID of the users to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#components/schemas/usersInputSchema'
 *     responses:
 *       200:
 *         description: users updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#components/schemas/usersUpdateResponse'
 * 
 */

/**
 * @swagger
 * /api/users/{usersId}:
 *   delete:
 *     tags:
 *        - Users
 *     summary: Delete a specific users by ID
 *     description: Delete a specific users record from MongoDB by its ID.
 *     parameters:
 *       - name: usersId
 *         in: path
 *         required: true
 *         type: string
 *         description: ID of the users to delete
 *     responses:
 *       200:
 *         description: users deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#components/schemas/usersDeleteResponse'
 */

/**
 * @swagger
 * /api/users/multiDelete:
 *   post:
 *     tags:
 *       - Users   
 *     summary: Delete multiple users records
 *     description: Delete multiple users records from MongoDB.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#components/schemas/MultideleteInput'
 *     responses:
 *       204:
 *         description: users deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#components/schemas/usersDeleteResponse'
 */