import { motion } from 'framer-motion'
const Mouse = () => {
    return (
        <motion.div
            animate={{
                y: [0, 30, 0],
            }}
            transition={{
                repeat: Infinity,
                duration: 2,
            }}
            className="absolute z-40 left-1/2 -translate-x-1/2 text-gray-500 hidden md:block lg:block"
        >
            <div className="w-6 h-10 border-2 z-40 border-white/20 rounded-full flex justify-center p-1">
                <div className="w-1 h-2 bg-white rounded-full" />
            </div>
        </motion.div>
    )
}

export default Mouse