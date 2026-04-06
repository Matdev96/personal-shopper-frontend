import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import AdminLayout from '../components/AdminLayout';
import useAuthStore from '../store/authStore';

export default function AdminProducts() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category_id: '',
    stock: '',
    size: '',
    color: '',
    imageUrl: '',
    imageFile: null,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [imageSource, setImageSource] = useState('url'); // ✅ NOVO: Controla se é URL ou arquivo

  useEffect(() => {
    if (!user?.is_admin) {
      navigate('/');
      return;
    }

    fetchProducts();
    fetchCategories();
  }, [user]);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/products?limit=100`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error('Erro ao buscar produtos');
      }

      const json = await response.json();
      // API retorna { items, total, page, pages }
      setProducts(json.items ?? json);
    } catch (error) {
      toast.error('Erro ao carregar produtos');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/categories?limit=100`);
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      // silencioso — categorias são opcionais no formulário
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // ✅ NOVO: Atualizar preview quando URL muda
  const handleImageUrlChange = (e) => {
    const url = e.target.value;
    setFormData({ ...formData, imageUrl: url });
    
    if (url) {
      setImagePreview(url);
    } else {
      setImagePreview(null);
    }
  };

  // ✅ NOVO: Atualizar preview quando arquivo é selecionado
  const handleImageFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, imageFile: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // ✅ NOVO: Alternar entre URL e Upload
  const handleImageSourceChange = (source) => {
    setImageSource(source);
    setImagePreview(null);
    setFormData({
      ...formData,
      imageUrl: '',
      imageFile: null,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.description || !formData.price || !formData.category_id) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    // ✅ NOVO: Validar se tem imagem
    if (!formData.imageUrl && !formData.imageFile) {
      toast.error('Selecione uma imagem (URL ou arquivo)');
      return;
    }

    try {
      const token = localStorage.getItem('token');

      const form = new FormData();
      form.append('name', formData.name);
      form.append('description', formData.description);
      form.append('price', formData.price);
      form.append('category_id', formData.category_id);
      form.append('stock', formData.stock || '0');
      if (formData.size) form.append('size', formData.size);
      if (formData.color) form.append('color', formData.color);

      if (imageSource === 'url' && formData.imageUrl) {
        form.append('image_url', formData.imageUrl);
      } else if (imageSource === 'file' && formData.imageFile) {
        form.append('image', formData.imageFile);
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/admin/products/`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      });

      if (!response.ok) {
        throw new Error('Erro ao criar produto');
      }

      toast.success('Produto criado com sucesso');
      setFormData({
        name: '',
        description: '',
        price: '',
        category_id: '',
        stock: '',
        size: '',
        color: '',
        imageUrl: '',
        imageFile: null,
      });
      setImagePreview(null);
      setImageSource('url');
      setShowForm(false);
      fetchProducts();
    } catch (error) {
      toast.error('Erro ao criar produto');
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Tem certeza que deseja deletar este produto?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/admin/products/${productId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error('Erro ao deletar produto');
      }

      toast.success('Produto deletado com sucesso');
      fetchProducts();
    } catch (error) {
      toast.error('Erro ao deletar produto');
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div>
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Gerenciamento de Produtos</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-semibold transition-colors"
          >
            {showForm ? 'Cancelar' : '+ Novo Produto'}
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Criar Novo Produto</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Nome do Produto *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="Ex: Camiseta Azul"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Categoria *
                  </label>
                  <select
                    name="category_id"
                    value={formData.category_id}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    <option value="">Selecione uma categoria</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Preço (R$) *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    step="0.01"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="Ex: 99.90"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Estoque *
                  </label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="Ex: 10"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Tamanho <span className="text-gray-400 font-normal">(opcional)</span>
                  </label>
                  <input
                    type="text"
                    name="size"
                    value={formData.size}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="Ex: P, M, G, 42"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Cor <span className="text-gray-400 font-normal">(opcional)</span>
                  </label>
                  <input
                    type="text"
                    name="color"
                    value={formData.color}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="Ex: Azul, Vermelho"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Descrição *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="Descreva o produto..."
                />
              </div>

              {/* ✅ NOVO: Seletor de fonte de imagem */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  Imagem do Produto *
                </label>
                <div className="flex gap-4 mb-4">
                  <button
                    type="button"
                    onClick={() => handleImageSourceChange('url')}
                    className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                      imageSource === 'url'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    📎 URL da Imagem
                  </button>
                  <button
                    type="button"
                    onClick={() => handleImageSourceChange('file')}
                    className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                      imageSource === 'file'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    📁 Upload do Computador
                  </button>
                </div>

                {/* ✅ NOVO: Campo de URL */}
                {imageSource === 'url' && (
                  <input
                    type="url"
                    value={formData.imageUrl}
                    onChange={handleImageUrlChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="Ex: https://example.com/image.jpg"
                  />
                )}

                {/* ✅ NOVO: Campo de Upload */}
                {imageSource === 'file' && (
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                )}
              </div>

              {/* ✅ NOVO: Preview melhorada */}
              {imagePreview && (
                <div>
                  <p className="text-sm font-semibold text-gray-900 mb-2">Prévia da Imagem</p>
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded-lg border-2 border-blue-600"
                    onError={() => {
                      toast.error('Erro ao carregar a imagem. Verifique a URL.');
                      setImagePreview(null);
                    }}
                  />
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors"
              >
                Criar Produto
              </button>
            </form>
          </div>
        )}

        {/* Lista de Produtos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              {product.image_url && (
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-4">
                <h3 className="text-lg font-bold text-gray-900 mb-2">{product.name}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-2xl font-bold text-blue-600">R$ {product.price.toFixed(2)}</span>
                  <span className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
                    {product.category?.name || 'Sem categoria'}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 mb-4 text-xs text-gray-500">
                  <span>Estoque: <strong>{product.stock ?? 0}</strong></span>
                  {product.size && <span>Tamanho: <strong>{product.size}</strong></span>}
                  {product.color && <span>Cor: <strong>{product.color}</strong></span>}
                </div>
                <button
                  onClick={() => handleDeleteProduct(product.id)}
                  className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg font-semibold transition-colors"
                >
                  Deletar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}