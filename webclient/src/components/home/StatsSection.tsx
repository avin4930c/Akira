import { stats } from '@/constants/homePageConstants'
import React from 'react'
import { motion } from 'framer-motion'

const StatsSection = () => {
    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-8">
            {stats.map((stat, index) => (
                <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                    className="text-center"
                >
                    <div className="flex items-center justify-center w-10 h-10 bg-accent-soft rounded-lg mb-2 mx-auto">
                        <stat.icon className="w-5 h-5 text-accent" />
                    </div>
                    <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                </motion.div>
            ))}
        </div>
    )
}

export default StatsSection