import Link from 'next/link'
import React from 'react'
import { Button } from '../ui/button'
import { Plus } from 'lucide-react'

const NewChatButton = () => {
    return (
        <Link href="/chat" className="block">
            <Button className="w-full justify-start text-[14px] bg-[#111111] border border-border/10 hover:border-accent/30 hover:bg-[#161616] text-zinc-300 transition-all font-medium py-5" variant="outline" size="sm">
                <div className="p-1 rounded bg-[#1a1a1a] mr-3">
                    <Plus className="w-4 h-4 text-accent" />
                </div>
                New Session
            </Button>
        </Link>
    )
}

export default NewChatButton