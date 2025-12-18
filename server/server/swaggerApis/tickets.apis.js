/**
 * @swagger
 * components:
 *   schemas:
 *     ticketsCreateResponse:
 *       type: object
 *       example:
 *         respCode: 204
 *         respMessage: Tickets created sucessfully  
 *         ticketsId: 65cf00cf79006139a66bfd62
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     ticketsUpdateResponse:
 *       type: object
 *       example:
 *         respCode: 205
 *         respMessage: Tickets updated sucessfully  
 *         ticketsId: 65cf00cf79006139a66bfd62
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     ticketsDeleteResponse:
 *       type: object
 *       example:
 *         respCode: 206
 *         respMessage: Tickets deleted sucessfully  
 *         ticketsId: 65cf00cf79006139a66bfd62
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
 * /api/tickets:
 *   get:
 *     tags:
 *        - Tickets
 *     summary: Get all tickets from MongoDB
 *     description: Retrieve all orders records from MongoDB.
 *     responses:
 *       200:
 *         description: Successful response
 */

/**
 * @swagger
 * /api/tickets/{ticketsId}:
 *   get:
 *     tags:
 *        - Tickets
 *     summary: Get a specific tickets by ID
 *     description: Retrieve a specific order record from MongoDB by its ID.
 *     parameters:
 *       - name: ticketsId
 *         in: path
 *         required: true
 *         type: string
 *         description: ID of the tickets to retrieve
 *     responses:
 *       200:
 *         description: Successful response
 */

/**
 * @swagger
 * /api/tickets:
 *   post:
 *     tags:
 *       - Tickets
 *     summary: Create a new tickets
 *     description: Create a new tickets record in MongoDB.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#components/schemas/ticketsInputSchema'
 *     responses:
 *       204:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#components/schemas/ticketsCreateResponse'
 */

/**
 * @swagger
 * /api/tickets/{ticketsId}:
 *   put:
 *     tags:
 *         - Tickets
 *     summary: Update a specific tickets by ID
 *     description: Update a specific tickets record in MongoDB by its ID.
 *     parameters:
 *       - name: ticketsId
 *         in: path
 *         required: true
 *         type: string
 *         description: ID of the tickets to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#components/schemas/ticketsInputSchema'
 *     responses:
 *       200:
 *         description: tickets updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#components/schemas/ticketsUpdateResponse'
 * 
 */

/**
 * @swagger
 * /api/tickets/{ticketsId}:
 *   delete:
 *     tags:
 *        - Tickets
 *     summary: Delete a specific tickets by ID
 *     description: Delete a specific tickets record from MongoDB by its ID.
 *     parameters:
 *       - name: ticketsId
 *         in: path
 *         required: true
 *         type: string
 *         description: ID of the tickets to delete
 *     responses:
 *       200:
 *         description: tickets deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#components/schemas/ticketsDeleteResponse'
 */

/**
 * @swagger
 * /api/tickets/multiDelete:
 *   post:
 *     tags:
 *       - Tickets   
 *     summary: Delete multiple tickets records
 *     description: Delete multiple tickets records from MongoDB.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#components/schemas/MultideleteInput'
 *     responses:
 *       204:
 *         description: tickets deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#components/schemas/ticketsDeleteResponse'
 */