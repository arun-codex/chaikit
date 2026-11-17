# Contributing to ChaiKit

Thank you for your interest in contributing to ChaiKit!

## Local Development Workflow

1. Clone the repository:
   ```bash
   git clone https://github.com/your-org/chaikit.git
   cd chaikit
   ```

2. Install dependencies:
   ```bash
   npm install --ignore-scripts
   ```

3. Run test suites:
   ```bash
   npm test
   ```

4. Build packages:
   ```bash
   npm run build
   ```

## Development Guidelines

- **Zero External Telemetry:** Never add tracking scripts or remote analytics.
- **Payment Truthfulness:** Never simulate or fake payment confirmations.
- **Accessibility:** All UI components must remain keyboard and screen-reader accessible.
- **Exact Currency Math:** Always represent amounts internally in integer paise.
