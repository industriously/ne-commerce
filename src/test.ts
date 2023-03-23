import { IProduct } from '@INTERFACE/product';
import { IConnection } from '@nestia/fetcher';
import typia from 'typia';
import { products } from './sdk/functional';

const connection: IConnection = {
  host: 'http://localhost:4000',
  headers: {
    Authorization:
      'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImYxYTk0OWFhLWJjNTctNDU3MS1iMzk2LWM5Y2NhNDMyODNiYyIsInJvbGUiOiJ2ZW5kZXIiLCJpYXQiOjE2Nzk1NjA3NDYsImV4cCI6MTY3OTU4OTU0Nn0.M6v-QThbuqL1z0tcOzuV0N2QubYf5LIrgfVOUhg2vv2-1giYr-Bgq6WoOJ8-_YWzPCpvccJoYFKlCFjNwuvxn19crqXAV2VJ4fMvptjDg8F5LYg6pqTufp2WURtsE8-LD838GaTLhznbQgo4YTneoUbZY_3U-EfRJb3EAlV0o03emV-AqEgkVJHbq5nEIhA-tFz0gIwWeack8HLwLrsL9CJe1B_-SXjfNh6YJYv9tsZiOVE3V7kc0r80OGPKpJLxGU_C_8_iEZcocUcjLhKan2YTuT4pB7PcaKLUexGkxjgdh_qy9gC4b9CQVX-W5IhEZq6Lxzux7OjLnjF84QkvFQ',
  },
};

interface Body1 extends IProduct.CreateBody {
  /**
   * @type uint
   * @step 1000
   * @minimum 10000
   */
  readonly price: number;
}
interface Body2 extends IProduct.CreateBody {
  /**
   * @type uint
   * @step 1000
   * @minimum 20000
   */
  readonly price: number;
}

new Array(5).fill(1).forEach(async () => {
  await products.create(connection, typia.random<Body1>());
  await products.create(connection, typia.random<Body2>());
});
