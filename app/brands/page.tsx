import { getBrands } from '@/services/brands.service'
import { WooBrand } from '@/types/brand.types'

const BrandsPage = async () => {
  const brands = await getBrands()
  return <div>{brands.data.map((brand: WooBrand) => brand.name)}</div>
}

export default BrandsPage
