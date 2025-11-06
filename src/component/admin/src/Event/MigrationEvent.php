<?php

/**
 * @package     Joomla.Administrator
 * @subpackage  com_cmsmigrator
 * @copyright   Copyright (C) 2025 Open Source Matters, Inc.
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */

namespace Joomla\Component\CmsMigrator\Administrator\Event;

\defined('_JEXEC') or die;

use Joomla\CMS\Event\AbstractEvent;
use Joomla\CMS\Event\Result\ResultAware;
use Joomla\CMS\Event\Result\ResultAwareInterface;

/**
 * Event class for migration operations.
 *
 * @since  1.0.0
 */
class MigrationEvent extends AbstractEvent implements ResultAwareInterface
{
    use ResultAware;

    /**
     * Get the event results.
     *
     * @return  array  The results array
     *
     * @since   1.0.0
     */
    public function getResults(): array
    {
        return $this->getArgument('result', []);
    }
}
