import { Component } from 'react';
import isEqual from 'shallowequal';

export default { create };

function create(asyncFn) {
  let displayName = asyncFn.name || asyncFn.displayName || 'Anonymous';
  return class extends Coroutine {
    static get displayName() {
      return `Coroutine(${displayName})`;
    }

    observe(props) {
      return asyncFn(props);
    }
  }
}

class Coroutine extends Component {
  constructor(props) {
    super(props);
    this.state = { data: null };
    this.iterator = null;
    this.isComponentMounted = false;
  }

  observe() {
    throw new Error('Coroutine::observe should be implemented by a subclass');
  }

  forceUpdate(props) {
    const asyncBody = this.observe(props);

    this.iterator = asyncBody;

    if (typeof asyncBody.then === 'function') {
      asyncBody.then(data => {
        if (this.isComponentMounted && this.iterator === asyncBody) {
          this.setState(() => ({ data }));
        }
      });
    } else {
      function resolveSyncIterator(i, step, cb) {
        if (!step.done) {
          if (step.value && typeof step.value.then === 'function') {
            step.value.then(data => resolveSyncIterator(i, i.next(data), cb));
          } else {
            resolveSyncIterator(i, i.next(step.value), cb);
          }
        } else {
          cb(step.value);
        }
      };

      function resolveAsyncIterator(i, step, cb) {
        step.then((data) => {
          if (data.value !== undefined) {
            cb(data.value);
          }

          return !data.done && resolveAsyncIterator(i, i.next(), cb);
        });
      };

      function resolveIterator(iterator, instance) {
        const step = iterator.next();

        const updater = (data) => {
          return instance.isComponentMounted && instance.setState({ data });
        };

        if (typeof step.then === 'function') {
          resolveAsyncIterator(iterator, step, updater);
        } else {
          resolveSyncIterator(iterator, step, updater);
        }
      };

      resolveIterator(this.iterator, this);
    }
  }

  componentDidMount() {
    this.isComponentMounted = true;
    return this.forceUpdate(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if (!isEqual(this.props, nextProps)) {
      if (this.iterator && this.iterator.return) {
        this.iterator.return();
      }

      if (this.isComponentMounted) {
        this.forceUpdate(nextProps);
      }
    }
  }

  componentWillUnmount() {
    if (this.iterator && this.iterator.return) {
      this.iterator.return();
    }

    this.isComponentMounted = false;
  }

  render() {
    return this.state.data;
  }
}
