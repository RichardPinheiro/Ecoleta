import { Request, Response } from 'express'
import knex from '../database/connection'

import points from '../../mock/points'
import items from '../../mock/items'

class PointsController {

    async list(request: Request, response: Response) {
        const { city, uf, items } = request.query

        const parsedItems = String(items).split(',').map(item => Number(item.trim()))

        const points = await knex('points')
            .join('point_items', 'points.id', '=', 'point_items.point_id')
            .whereIn('point_items.point_id', parsedItems)
            .where('city', String(city))
            .where('uf', String(uf))
            .distinct()
            .select('points.*')

        return response.json(points)
    }

    async show(request: Request, response: Response) {
        const { id } = request.params

        const point = await points.find((point: any) => point.id == id)

        if (!point) {
            return response.status(404).json({ message: 'Point not found.' })
        }

        return response.json({
            point,
            items
        })
    }
    async create(request: Request, response: Response) {
        const {
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf,
            items
        } = request.body;
    
        const transaction = await knex.transaction()

        const point = {
            image: 'image-fake',
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf
        }
    
        const insertedIds =  await transaction('points').insert(point)
    
        const point_id = insertedIds[0]
    
        const pointItems = items.map((item_id: number) => {
            return {
                item_id,
                point_id,
            }
        })
    
        await transaction('point_items').insert(pointItems);

        await transaction.commit()

        return response.json({
            id: point_id,
            ...point
        })
    }
}

export default new PointsController