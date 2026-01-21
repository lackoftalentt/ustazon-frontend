import { CreateKMZHModal } from '@/features/create-kmzh'
import { CreateMaterialModal } from '@/features/create-material'
import { CreateTestModal } from '@/features/create-test'
import { Breadcrumb } from '@/widgets/breadcrumb'
import { Footer } from '@/widgets/footer'
import { Header } from '@/widgets/header'
import { SpeedDial } from '@/widgets/speed-dial/ui/SpeedDial'
import { Outlet } from 'react-router-dom'
import s from './MainLayout.module.scss'

export const MainLayout = () => {
	return (
		<>
			<Header />
			<main className={s.mainLayout}>
				<Breadcrumb />
				<Outlet />
				<SpeedDial />
			</main>
			<Footer />
			<CreateMaterialModal />
			<CreateKMZHModal />
			<CreateTestModal />
		</>
	)
}
