const CategoryPageNumber = async ({ params }: { params: Promise<{ slug: string; num: string }> }) => {
  const { slug, num } = await params
  return (
    <div>
      CategoryPageNumber {slug} {num}
    </div>
  )
}

export default CategoryPageNumber
