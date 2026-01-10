import React from 'react'
import banner from '../assets/souses.png'
import { useSelector } from 'react-redux'
import { valideURLConvert } from '../utils/valideURLConvert'
import { useNavigate } from 'react-router-dom'
import CategoryWiseProductDisplay from '../components/CategoryWiseProductDisplay'

const Home = () => {

  const loadingCategory = useSelector(state => state.product.loadingCategory)
  const categoryData = useSelector(state => state.product.allCategory)
  const subCategoryData = useSelector(state => state.product.allSubCategory)
  const navigate = useNavigate()

  const handleRedirectProductListpage = (id, cat) => {
    const subcategory = subCategoryData.find(sub => {
      const filterData = sub.category.some(c => c._id == id)
      return filterData ? true : null
    })

    const url = `/${valideURLConvert(cat)}-${id}/${valideURLConvert(subcategory.name)}-${subcategory._id}`
    navigate(url)
  }

  return (
    <section className='bg-white'>

      {/* =============================== */}
      {/* 🔥 SINGLE IMAGE BANNER SECTION */}
      {/* =============================== */}

      <div className="w-full">
        <img
          src={banner}
          alt="banner"
          className="w-full h-[500px] object-cover"
        />
      </div>

      {/* =============================== */}
      {/* CATEGORY GRID */}
      {/* =============================== */}

      <div className='container mx-auto px-4 my-4 grid grid-cols-5 md:grid-cols-8 lg:grid-cols-10 gap-2'>
        {
          loadingCategory ? (
            new Array(12).fill(null).map((c, index) => (
              <div key={index + "load"} className='bg-white rounded p-4 min-h-36 grid gap-2 shadow animate-pulse'>
                <div className='bg-blue-100 min-h-24 rounded'></div>
                <div className='bg-blue-100 h-8 rounded'></div>
              </div>
            ))
          ) : (
            categoryData.map((cat) => (
              <div
                key={cat._id + "cat"}
                className='w-full h-full cursor-pointer'
                onClick={() => handleRedirectProductListpage(cat._id, cat.name)}
              >
                <img
                  src={cat.image}
                  className='w-full h-full object-scale-down'
                  alt={cat.name}
                />
              </div>
            ))
          )
        }
      </div>

      {/* =============================== */}
      {/* CATEGORY-WISE PRODUCT DISPLAY */}
      {/* =============================== */}

      {
        categoryData?.map((c) => (
          <CategoryWiseProductDisplay
            key={c?._id + "CW"}
            id={c?._id}
            name={c?.name}
          />
        ))
      }

    </section>
  )
}

export default Home
