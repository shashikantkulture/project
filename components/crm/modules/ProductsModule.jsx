// components/crm/modules/ProductsModule.jsx
import React, { useState, useMemo } from 'react';

export default function ProductsModule({
  products,
  onSelectProduct,
  selectedProduct,
  onCloseProductDetail,
  onAddProduct,
  onUpdateProduct
}) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProductForm, setNewProductForm] = useState({
    title: '',
    subtitle: '',
    category: 'Imperial Sculptures',
    sku: '',
    price: 185000,
    stock: 5,
    material: 'Cast Bronze & 24k Gold Foil',
    dimensions: '40 x 25 x 50 cm',
    weight: '12 kg',
    vastuZone: 'North / North-East',
    image: '/images/products/Emerald and Gold Wave Sculpture.png',
    description: ''
  });

  const categories = [
    'All',
    'Imperial Sculptures',
    'Artisanal Sculptures',
    'Vastu Masterpieces',
    'Toroidal Ceramics',
    'Heirloom Furniture',
    'Porcelain Masterpieces'
  ];

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchSearch =
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.sku.toLowerCase().includes(search.toLowerCase()) ||
        p.category.toLowerCase().includes(search.toLowerCase());
      const matchCat = selectedCategory === 'All' || p.category === selectedCategory;
      const matchStat = selectedStatus === 'All' || p.status === selectedStatus;
      return matchSearch && matchCat && matchStat;
    });
  }, [products, search, selectedCategory, selectedStatus]);

  const handleAddProductSubmit = (e) => {
    e.preventDefault();
    const newProd = {
      id: `prod-${Date.now()}`,
      title: newProductForm.title,
      subtitle: newProductForm.subtitle || 'Handcrafted Curatorial Masterpiece',
      sku: newProductForm.sku || `LX-${Math.floor(1000 + Math.random() * 9000)}`,
      category: newProductForm.category,
      price: Number(newProductForm.price),
      salePrice: null,
      stock: Number(newProductForm.stock),
      status: Number(newProductForm.stock) > 3 ? 'Active' : 'Low Stock',
      sales: 0,
      revenue: 0,
      rating: 5.0,
      reviewsCount: 0,
      image: newProductForm.image || '/images/products/Emerald and Gold Wave Sculpture.png',
      dimensions: newProductForm.dimensions,
      weight: newProductForm.weight,
      material: newProductForm.material,
      vastuZone: newProductForm.vastuZone,
      description: newProductForm.description || 'Artisanal heirloom curation crafted for prestigious residences.'
    };
    onAddProduct(newProd);
    setShowAddModal(false);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-300';
      case 'Low Stock':
        return 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-300';
      case 'Out of Stock':
        return 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-300';
      default:
        return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            Curatorial Products & Masterpieces
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Artisanal sculptures, astronomical horology, toroidal ceramics, and sacred Vastu collections.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-5 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-blue-500/20 transition-all self-start sm:self-auto"
        >
          <span className="material-symbols-outlined text-base">add</span>
          <span>Add Masterpiece</span>
        </button>
      </div>

      {/* Toolbar: Search & Filter */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <span className="material-symbols-outlined text-slate-400 text-lg absolute left-3.5 top-1/2 -translate-y-1/2">
            search
          </span>
          <input
            type="text"
            placeholder="Search by title, SKU, or collection..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full text-xs">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCategory(c)}
              className={`px-3 py-1.5 rounded-full font-bold whitespace-nowrap transition-colors ${
                selectedCategory === c
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200/80 dark:border-slate-800'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Product Catalog Table */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-[0_4px_25px_rgba(0,0,0,0.02)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/70 dark:bg-slate-800/40 text-[10px] uppercase font-bold text-slate-400 tracking-wider border-b border-slate-100 dark:border-slate-800">
                <th className="py-3.5 px-4">MASTERPIECE</th>
                <th className="py-3.5 px-4">SKU</th>
                <th className="py-3.5 px-4">CATEGORY</th>
                <th className="py-3.5 px-4">PRICE</th>
                <th className="py-3.5 px-4">STOCK</th>
                <th className="py-3.5 px-4">STATUS</th>
                <th className="py-3.5 px-4">SALES</th>
                <th className="py-3.5 px-4">TOTAL REVENUE</th>
                <th className="py-3.5 px-4 text-center">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {filteredProducts.map((p) => (
                <tr
                  key={p.id}
                  onClick={() => onSelectProduct(p)}
                  className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors cursor-pointer group"
                >
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={p.image}
                        alt={p.title}
                        className="w-12 h-12 rounded-xl object-cover bg-slate-100 dark:bg-slate-800 shrink-0 shadow-2xs"
                      />
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                          {p.title}
                        </div>
                        <div className="text-[10px] text-slate-400 line-clamp-1">
                          {p.subtitle}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500 dark:text-slate-400 font-semibold">
                    {p.sku}
                  </td>
                  <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300 font-medium">
                    {p.category}
                  </td>
                  <td className="py-3.5 px-4 font-extrabold text-slate-900 dark:text-white font-mono">
                    ₹{p.price.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-800 dark:text-slate-200">
                    {p.stock} units
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${getStatusBadge(p.status)}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                    {p.sales} sold
                  </td>
                  <td className="py-3.5 px-4 font-bold text-emerald-600">
                    ₹{(p.revenue / 100000).toFixed(1)}L
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectProduct(p);
                      }}
                      className="px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors"
                    >
                      Inspect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* PRODUCT DETAIL DRAWER */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-xl h-full bg-white dark:bg-slate-900 shadow-2xl p-6 overflow-y-auto flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    {selectedProduct.title}
                  </h2>
                  <div className="text-xs text-slate-400 font-mono mt-0.5">
                    SKU: {selectedProduct.sku} • {selectedProduct.category}
                  </div>
                </div>

                <button
                  onClick={onCloseProductDetail}
                  className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-white"
                >
                  ✕
                </button>
              </div>

              {/* Product Hero Image */}
              <div className="mt-4 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 aspect-video flex items-center justify-center">
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Price & Stock Banner */}
              <div className="mt-4 p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Acquisition Price</div>
                  <div className="text-xl font-extrabold text-slate-900 dark:text-white font-mono mt-0.5">
                    ₹{selectedProduct.price.toLocaleString('en-IN')}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Available In Vaults</div>
                  <div className="text-sm font-bold text-emerald-600 mt-0.5">
                    {selectedProduct.stock} units ready
                  </div>
                </div>
              </div>

              {/* Curatorial Story */}
              <div className="mt-5 space-y-2 text-xs">
                <div className="font-bold text-slate-900 dark:text-white">Curatorial Description</div>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                  {selectedProduct.description}
                </p>
              </div>

              {/* Material & Vastu Specifications */}
              <div className="mt-5 space-y-2 text-xs">
                <div className="font-bold text-slate-900 dark:text-white">Physical & Metaphysical Specs</div>
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-2 text-slate-700 dark:text-slate-300">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Material Composition:</span>
                    <span className="font-semibold text-right">{selectedProduct.material}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Dimensions:</span>
                    <span className="font-semibold">{selectedProduct.dimensions}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Weight:</span>
                    <span className="font-semibold">{selectedProduct.weight}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Vastu Energy Zone:</span>
                    <span className="font-semibold text-emerald-600">{selectedProduct.vastuZone}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={onCloseProductDetail}
                className="w-full py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs"
              >
                Close Spec Sheet
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD MASTERPIECE MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-100 dark:border-slate-800 animate-fadeIn max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Add Curatorial Masterpiece
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </div>

            <form onSubmit={handleAddProductSubmit} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Masterpiece Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Celestial Horology Tourbillon"
                  value={newProductForm.title}
                  onChange={(e) => setNewProductForm({ ...newProductForm, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Category</label>
                  <select
                    value={newProductForm.category}
                    onChange={(e) => setNewProductForm({ ...newProductForm, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none"
                  >
                    <option value="Imperial Sculptures">Imperial Sculptures</option>
                    <option value="Artisanal Sculptures">Artisanal Sculptures</option>
                    <option value="Vastu Masterpieces">Vastu Masterpieces</option>
                    <option value="Toroidal Ceramics">Toroidal Ceramics</option>
                    <option value="Heirloom Furniture">Heirloom Furniture</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">SKU</label>
                  <input
                    type="text"
                    placeholder="LX-SC-CH-12"
                    value={newProductForm.sku}
                    onChange={(e) => setNewProductForm({ ...newProductForm, sku: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Price (₹) *</label>
                  <input
                    type="number"
                    required
                    step="10000"
                    value={newProductForm.price}
                    onChange={(e) => setNewProductForm({ ...newProductForm, price: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Stock Units</label>
                  <input
                    type="number"
                    value={newProductForm.stock}
                    onChange={(e) => setNewProductForm({ ...newProductForm, stock: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Product Photography Image Path
                </label>
                <select
                  value={newProductForm.image}
                  onChange={(e) => setNewProductForm({ ...newProductForm, image: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none"
                >
                  <option value="/images/products/Emerald and Gold Wave Sculpture.png">Emerald & Gold Wave Sculpture</option>
                  <option value="/images/products/Chrome Deer Sculpture on a Walnut Table.png">Chrome Deer Sculpture on Walnut Table</option>
                  <option value="/images/products/Golden Antelope in Sunlit Elegance.png">Golden Antelope in Sunlit Elegance</option>
                  <option value="/images/products/Jeweled Chrome Deer Pair.png">Jeweled Chrome Deer Pair</option>
                  <option value="/images/products/Rose-Gold Eagle Winter Elegance.png">Rose-Gold Eagle Winter Elegance</option>
                  <option value="/images/products/Textured Sandstone Donut Vase.png">Textured Sandstone Donut Vase</option>
                  <option value="/images/products/Vibrant Bougainvillea in Textured Vase.png">Vibrant Bougainvillea in Textured Vase</option>
                  <option value="/images/products/Serene Emerald Bust in a Luxe Interior.png">Serene Emerald Bust</option>
                  <option value="/images/products/Polished Silver Camel Sculpture.png">Polished Silver Camel Sculpture</option>
                  <option value="/images/products/Elegant Ceramic Swan Pair Display.png">Elegant Ceramic Swan Pair Display</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Curatorial background, artisan foundry details..."
                  value={newProductForm.description}
                  onChange={(e) => setNewProductForm({ ...newProductForm, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md shadow-blue-500/20 transition-all"
                >
                  Publish to Catalog
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
