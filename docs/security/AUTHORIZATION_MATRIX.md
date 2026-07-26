# Authorization Matrix

Roles: Organization Owner · Organization Admin · Store Admin · Store Manager · Catalog Manager · Inventory Manager · Order Manager · Marketing Manager · Analyst · Support Agent · Finance · Developer · Read Only

| Permission | Owner | Org Admin | Store Admin | Store Mgr | Catalog | Inventory | Orders | Marketing | Analyst | Support | Finance | Developer | RO |
|------------|:-----:|:---------:|:-----------:|:---------:|:-------:|:---------:|:------:|:---------:|:-------:|:-------:|:-------:|:---------:|:--:|
| organizations.manage | Y | Y | | | | | | | | | | | |
| stores.manage | Y | Y | Y | | | | | | | | | | |
| team.manage | Y | Y | Y | | | | | | | | | | |
| billing.manage | Y | Y | | | | | | | | | Y | | |
| products.read | Y | Y | Y | Y | Y | Y | Y | Y | Y | Y | Y | Y | Y |
| products.write | Y | Y | Y | Y | Y | | | | | | | | |
| inventory.read | Y | Y | Y | Y | Y | Y | Y | | Y | Y | | | Y |
| inventory.write | Y | Y | Y | Y | | Y | | | | | | | |
| orders.read | Y | Y | Y | Y | | | Y | | Y | Y | Y | | Y |
| orders.manage | Y | Y | Y | Y | | | Y | | | Y | | | |
| refunds.create | Y | Y | Y | | | | Y | | | | Y | | |
| refunds.approve | Y | Y | Y | | | | | | | | Y | | |
| customers.read | Y | Y | Y | Y | | | Y | Y | Y | Y | | | Y |
| customers.export | Y | Y | Y | | | | | | | | Y | | |
| analytics.read | Y | Y | Y | Y | | | | Y | Y | | Y | | Y |
| marketing.manage | Y | Y | Y | | | | | Y | | | | | |
| apps.install | Y | Y | Y | | | | | | | | | Y | |
| api.manage | Y | Y | | | | | | | | | | Y | |
| ai.execute | Y | Y | Y | Y | Y | Y | Y | Y | | Y | | | |
| ai.approve | Y | Y | Y | | | | | | | | | | |
| audit.read | Y | Y | Y | | | | | | | | Y | | |
