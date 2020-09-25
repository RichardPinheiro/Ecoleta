import { Router } from 'express'

import ItemsController from '../controllers/ItemsController'
import PointsController from '../controllers/PointsController'

const routes = Router()

routes.get('/items', ItemsController.list)

routes.post('/points', PointsController.create)
routes.get('/points/:id', PointsController.show)

export default routes