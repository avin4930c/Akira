import Link from 'next/link'
import React from 'react'
import { Button } from '../ui/button'
import { Plus } from 'lucide-react'

const NewChatButton = () => {
    return (
        <Link href="/chat" className="block mt-4">
            <Button className="w-full justify-start" variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                New Chat
            </Button>
        </Link>
    )
}

export default NewChatButton