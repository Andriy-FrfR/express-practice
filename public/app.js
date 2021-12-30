const formatPrice = () => {
  document.querySelectorAll('.price')
  .forEach((node) => {
    node.textContent = new Intl.NumberFormat('ru-RU', {
      currency: 'rub',
      style: 'currency'
    }).format(node.textContent);
  });
}

formatPrice();

const toDate = (date) => {
  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  }).format(new Date(date));
};

document.querySelectorAll('.date').forEach(node => {
  node.textContent = toDate(node.textContent);
});

const $cart = document.querySelector('#cart');

if ($cart) {
  const updateCart = (cart) => {
    if (cart.courses.length) {
      const cartTbody = $cart.querySelector('.cart-tbody');
      cartTbody.innerHTML = '';

      for (const course of cart.courses) {
        cartTbody.innerHTML += `
        <tr>
          <th>${course.title}</th>
          <th>${course.count}</th>
          <th>
            <button class="btn btn-small js-remove" data-id="${course._id}" data-csrf="${cart.csrf}">Удалить</button>
          </th>
        </tr>
        `;
      }

      $cart.querySelector('.price').textContent = cart.price;
      formatPrice();
    } else {
      $cart.innerHTML = '<p>Корзина пуста</p>';
    }
  };

  $cart.addEventListener('click', event => {
    const btn = event.target.closest('.js-remove');
    if (!btn) return;

    fetch(`/cart/remove/${btn.dataset.id}`, {
      method: 'delete',
      headers: {
        'X-XSRF-TOKEN': btn.dataset.csrf
      }
    }).then(res => res.json())
      .then(cart => {
        updateCart(cart);
      });
  });
}

let instance = M.Tabs.init(document.querySelectorAll('.tabs'));

