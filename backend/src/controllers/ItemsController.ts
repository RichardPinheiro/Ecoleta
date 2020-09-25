import { Request, Response } from 'express'

import items from '../../mock/items'


class ItemsController {
    list (request: Request, response: Response) {

        const serializedItems = items.map(item => {
            return { 
                id: item.id,
                title: item.title,
                image_url: `http://localhost:3333/uploads/${item.image}`
            }
        })
    
        return response.json(serializedItems)
    }
}

export default new ItemsController